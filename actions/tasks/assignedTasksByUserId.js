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

            const incidents = await ctx.call("incidents.find", { query: { id: incidentIds } });

            const [users, companies, statuses, priorities, categories, machines, productionPhases] = await Promise.all([
                ctx.call("users.find", { query: { id: userIds } }),
                ctx.call("companies.find", { query: { id: companyIds } }),
                ctx.call("statuses.find", { query: { id: incidents.map(inc => inc.status_id) } }),
                ctx.call("priorities.find", { query: { id: incidents.map(inc => inc.priority_id) } }),
                ctx.call("categories.find", { query: { id: incidents.map(inc => inc.category_id) } }),
                ctx.call("machines.find", { query: { id: incidents.map(inc => inc.machine_id) } }),
                ctx.call("production_phases.find", { query: { id: incidents.map(inc => inc.production_phase_id) } })
            ]);

            const incidentMap = incidents.reduce((acc, incident) => {
                acc[incident.id] = incident;
                return acc;
            }, {});

            const userMap = users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});

            const companyMap = companies.reduce((acc, company) => {
                acc[company.id] = company;
                return acc;
            }, {});

            const statusMap = statuses.reduce((acc, status) => {
                acc[status.id] = status;
                return acc;
            }, {});

            const priorityMap = priorities.reduce((acc, priority) => {
                acc[priority.id] = priority;
                return acc;
            }, {});

            const categoryMap = categories.reduce((acc, category) => {
                acc[category.id] = category;
                return acc;
            }, {});

            const machineMap = machines.reduce((acc, machine) => {
                acc[machine.id] = machine;
                return acc;
            }, {});

            const productionPhaseMap = productionPhases.reduce((acc, productionPhase) => {
                acc[productionPhase.id] = productionPhase;
                return acc;
            }, {});

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
                    user: userMap[incidentMap[task.incident_id]?.user_id] || { id: null, name: "Unknown User", email: "Unknown Email" },
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