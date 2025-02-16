"use strict";

module.exports = {
    async findAssignedTasksByUserId(ctx) {
        const userId = ctx.params.userId;
        if (!userId) {
            throw new Error("User ID is required");
        }

        const query = { assigned_user_id: userId };
        try {
            const assignedTasks = await this.adapter.find({
                query,
                populate: ["incident_id", "assigned_user_id", "company_id"]
            });

            const incidentIds = [...new Set(assignedTasks.map(task => task.incident_id))];
            const userIds = [...new Set(assignedTasks.map(task => task.assigned_user_id))];
            const companyIds = [...new Set(assignedTasks.map(task => task.company_id))];

            const incidents = await ctx.call("incidents.find", { query: { id: incidentIds }, meta: { cache: false } });

            const statusIds = [...new Set(incidents.map(inc => inc.status_id))];
            const priorityIds = [...new Set(incidents.map(inc => inc.priority_id))];
            const categoryIds = [...new Set(incidents.map(inc => inc.category_id))];
            const machineIds = [...new Set(incidents.map(inc => inc.machine_id))];
            const productionPhaseIds = [...new Set(incidents.map(inc => inc.production_phase_id))];

            const [users, companies, statuses, priorities, categories, machines, productionPhases] = await Promise.all([
                ctx.call("users.find", { query: { id: userIds }, meta: { cache: false } }),
                ctx.call("companies.find", { query: { id: companyIds }, meta: { cache: false } }),
                ctx.call("statuses.find", { query: { id: statusIds }, meta: { cache: false } }),
                ctx.call("priorities.find", { query: { id: priorityIds }, meta: { cache: false } }),
                ctx.call("categories.find", { query: { id: categoryIds }, meta: { cache: false } }),
                ctx.call("machines.find", { query: { id: machineIds }, meta: { cache: false } }),
                ctx.call("production_phases.find", { query: { id: productionPhaseIds }, meta: { cache: false } })
            ]);

            const createMap = (items, key = 'id') => items.reduce((acc, item) => {
                acc[item[key]] = item;
                return acc;
            }, {});

            const incidentMap = createMap(incidents);
            const userMap = createMap(users);
            const companyMap = createMap(companies);
            const statusMap = createMap(statuses);
            const priorityMap = createMap(priorities);
            const categoryMap = createMap(categories);
            const machineMap = createMap(machines);
            const productionPhaseMap = createMap(productionPhases);

            const tasksWithDetails = assignedTasks.map(task => ({
                id: task.id,
                name: task.name,
                incident: {
                    id: task.incident_id,
                    title: incidentMap[task.incident_id]?.title || "Unknown Incident",
                    description: incidentMap[task.incident_id]?.description || "Unknown Description",
                    status: statusMap[incidentMap[task.incident_id]?.status_id] || { id: null, name: "Unknown Status" },
                    priority: priorityMap[incidentMap[task.incident_id]?.priority_id] || { id: null, name: "Unknown Priority" },
                    category: categoryMap[incidentMap[task.incident_id]?.category_id] || { id: null, name: "Unknown Category" },
                    machine: machineMap[incidentMap[task.incident_id]?.machine_id] || { id: null, name: "Unknown Machine" },
                    production_phase: productionPhaseMap[incidentMap[task.incident_id]?.production_phase_id] || { id: null, name: "Unknown Production Phase" },
                    creation_date: incidentMap[task.incident_id]?.creation_date || "Unknown Creation Date",
                    update_date: incidentMap[task.incident_id]?.update_date || "Unknown Update Date"
                },
                user: {
                    id: task.assigned_user_id,
                    name: userMap[task.assigned_user_id]?.name || "Unknown User"
                },
                company: {
                    id: task.company_id,
                    name: companyMap[task.company_id]?.name || "Unknown Company"
                }
            }));

            return tasksWithDetails;
        } catch (error) {
            console.error("Error fetching assigned tasks by user ID:", error);
            throw new Error("Failed to fetch assigned tasks by user ID");
        }
    }
};
