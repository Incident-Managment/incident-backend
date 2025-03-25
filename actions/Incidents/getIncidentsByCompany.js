"use strict";

module.exports = {
    async getIncidentsByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        try {
            const incidents = await this.adapter.find({ query: { company_id: companyId } });

            const statusIds = [...new Set(incidents.map(incident => incident.status_id))];
            const priorityIds = [...new Set(incidents.map(incident => incident.priority_id))];
            const categoryIds = [...new Set(incidents.map(incident => incident.category_id))];
            const userIds = [...new Set(incidents.map(incident => incident.user_id))];
            const machineIds = [...new Set(incidents.map(incident => incident.machine_id))];
            const productionPhaseIds = [...new Set(incidents.map(incident => incident.production_phase_id))];
            const incidentIds = incidents.map(incident => incident.id);

            const [statuses, priorities, categories, users, machines, productionPhases, assignedTasks, company] = await Promise.all([
                ctx.call("statuses.find", { id: statusIds }),
                ctx.call("priorities.find", { id: priorityIds }),
                ctx.call("categories.find", { id: categoryIds }),
                ctx.call("users.find", { id: userIds }),
                ctx.call("machines.getMachinesGlobal", { id: machineIds }),
                ctx.call("production_phases.find", { id: productionPhaseIds }),
                ctx.call("assigned_tasks.findAssignedTasks", { query: { incident_id: incidentIds } }),
                ctx.call("companies.get", { id: companyId })
            ]);

            const statusMap = statuses.reduce((acc, status) => {
                acc[status.id] = status.name;
                return acc;
            }, {});

            const priorityMap = priorities.reduce((acc, priority) => {
                acc[priority.id] = priority.name;
                return acc;
            }, {});

            const categoryMap = categories.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});

            const userMap = users.reduce((acc, user) => {
                acc[user.id] = { name: user.name, email: user.email };
                return acc;
            }, {});

            const machineMap = machines.reduce((acc, machine) => {
                acc[machine.id] = machine.name;
                return acc;
            }, {});

            const productionPhaseMap = productionPhases.reduce((acc, phase) => {
                acc[phase.id] = phase.name;
                return acc;
            }, {});

            const assignedTaskMap = assignedTasks.reduce((acc, task) => {
                acc[task.incident_id] = {
                    id: task.id,
                    assigned_user_id: task.assigned_user_id,
                    company_id: task.company_id,
                    assignment_date: task.assignment_date,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt
                };
                return acc;
            }, {});

            const incidentsWithDetails = incidents.map(incident => ({
                id: incident.id,
                title: incident.title,
                description: incident.description,
                status: {
                    id: incident.status_id,
                    name: statusMap[incident.status_id]
                },
                priority: {
                    id: incident.priority_id,
                    name: priorityMap[incident.priority_id]
                },
                category: {
                    id: incident.category_id,
                    name: categoryMap[incident.category_id]
                },
                user: {
                    id: incident.user_id,
                    name: userMap[incident.user_id].name,
                    email: userMap[incident.user_id].email
                },
                machine: {
                    id: incident.machine_id,
                    name: machineMap[incident.machine_id]
                },
                production_phase: {
                    id: incident.production_phase_id,
                    name: productionPhaseMap[incident.production_phase_id]
                },
                assigned_task: assignedTaskMap[incident.id] || null,
                company: {
                    id: company.id,
                    name: company.name
                },
                creation_date: incident.creation_date,
                update_date: incident.update_date
            }));

            incidentsWithDetails.sort((a, b) => a.id - b.id);

            return incidentsWithDetails;
        } catch (error) {
            console.error("Error fetching incidents by company:", error);
            throw new Error(`Failed to fetch incidents: ${error.message}`);
        }
    }
};