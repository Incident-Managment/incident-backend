"use strict";

module.exports = {
    async getIncidentsByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        try {
            const incidents = await this.adapter.find({ query: { company_id: companyId } });

            if (incidents.length === 0) return [];

            const statusIds = [...new Set(incidents.map(incident => incident.status_id))];
            const priorityIds = [...new Set(incidents.map(incident => incident.priority_id))];
            const categoryIds = [...new Set(incidents.map(incident => incident.category_id))];
            const userIds = [...new Set(incidents.map(incident => incident.user_id))];
            const machineIds = [...new Set(incidents.map(incident => incident.machine_id))];
            const productionPhaseIds = [...new Set(incidents.map(incident => incident.production_phase_id))];
            const incidentIds = incidents.map(incident => incident.id);

            const [statuses, priorities, categories, users, machines, productionPhases, assignedTasks, company] = await Promise.all([
                ctx.call("statuses.find", { query: { id: statusIds } }),
                ctx.call("priorities.find", { query: { id: priorityIds } }),
                ctx.call("categories.find", { query: { id: categoryIds } }),
                ctx.call("users.find", { query: { id: userIds } }),
                ctx.call("machines.getMachinesGlobal", { query: { id: machineIds } }),
                ctx.call("production_phases.find", { query: { id: productionPhaseIds } }),
                ctx.call("assigned_tasks.findAssignedTasks", { query: { incident_id: incidentIds } }),
                ctx.call("companies.get", { id: companyId })
            ]);

            // Crear mapas para acceso rápido
            const createMap = (array, keyField, valueField) =>
                array.reduce((acc, item) => {
                    acc[item[keyField]] = valueField ? item[valueField] : item;
                    return acc;
                }, {});

            const statusMap = createMap(statuses, "id", "name");
            const priorityMap = createMap(priorities, "id", "name");
            const categoryMap = createMap(categories, "id", "name");
            const userMap = createMap(users, "id");
            const machineMap = createMap(machines, "id", "name");
            const productionPhaseMap = createMap(productionPhases, "id", "name");
            const assignedTaskMap = createMap(assignedTasks, "incident_id");

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
                user: userMap[incident.user_id]
                    ? {
                          id: incident.user_id,
                          name: userMap[incident.user_id].name,
                          email: userMap[incident.user_id].email
                      }
                    : null,
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