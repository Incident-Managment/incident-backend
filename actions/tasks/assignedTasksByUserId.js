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

            let incidents = await ctx.call("incidents.getIncidentsByCompany", { 
                companyId: companyIds,
                where: { id: { in: incidentIds } }
            });

            const [users, companies] = await Promise.all([
                ctx.call("users.getUsersGlobal", { id: userIds, meta: { cache: false } }),
                ctx.call("companies.getCompaniesGlobal", { id: companyIds, meta: { cache: false } })
            ]);

            const createMap = (items, key = 'id') => items.reduce((acc, item) => {
                acc[item[key]] = item;
                return acc;
            }, {});

            const incidentMap = createMap(incidents);
            const userMap = createMap(users);
            const companyMap = createMap(companies);

            const tasksWithDetails = assignedTasks.map(task => {
                const incident = incidentMap[task.incident_id] || {};
                return {
                    id: task.id,
                    name: task.name,
                    incident: {
                        id: task.incident_id,
                        title: incident.title || "Unknown Incident",
                        description: incident.description || "Unknown Description",
                        status: incident.status || { id: null, name: "Unknown Status" },
                        priority: incident.priority || { id: null, name: "Unknown Priority" },
                        category: incident.category || { id: null, name: "Unknown Category" },
                        machine: incident.machine || { id: null, name: "Unknown Machine" },
                        production_phase: incident.production_phase || { id: null, name: "Unknown Production Phase" },
                        creation_date: incident.creation_date || "Unknown Creation Date",
                        update_date: incident.update_date || "Unknown Update Date"
                    },
                    user: {
                        id: task.assigned_user_id,
                        name: userMap[task.assigned_user_id]?.name || "Unknown User"
                    },
                    company: {
                        id: task.company_id,
                        name: companyMap[task.company_id]?.name || "Unknown Company"
                    }
                };
            });

            return tasksWithDetails;
        } catch (error) {
            console.error("Error fetching assigned tasks by user ID:", error);
            throw new Error("Failed to fetch assigned tasks by user ID");
        }
    }
};