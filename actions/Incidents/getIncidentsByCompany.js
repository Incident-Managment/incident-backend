"use strict";

module.exports = {
    async getIncidentsByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) throw new Error("Company ID is required");

        try {
            const incidents = await this.adapter.find({ query: { company_id: companyId } });

            if (!incidents.length) return [];

            // Extraer IDs únicos para reducir llamadas
            const extractUniqueIds = (key) => [...new Set(incidents.map((i) => i[key]).filter(Boolean))];

            const statusIds = extractUniqueIds("status_id");
            const priorityIds = extractUniqueIds("priority_id");
            const categoryIds = extractUniqueIds("category_id");
            const userIds = extractUniqueIds("user_id");
            const machineIds = extractUniqueIds("machine_id");
            const productionPhaseIds = extractUniqueIds("production_phase_id");
            const incidentIds = incidents.map((i) => i.id);

            // Llamadas en paralelo
            const [statuses, priorities, categories, users, machines, productionPhases, company, assignedTasks] = await Promise.all([
                ctx.call("statuses.find", { query: { id: statusIds } }),
                ctx.call("priorities.find", { query: { id: priorityIds } }),
                ctx.call("categories.find", { query: { id: categoryIds } }),
                ctx.call("users.find", { query: { id: userIds } }),
                ctx.call("machines.find", { query: { id: machineIds } }),
                ctx.call("production_phases.find", { query: { id: productionPhaseIds } }),
                ctx.call("companies.get", { id: companyId }),
                ctx.call("assigned_tasks.find", { query: { incident_id: incidentIds } }),
            ]);

            // Convertir listas en objetos para acceso rápido
            const createMap = (arr, key, valueMapper) => Object.fromEntries(arr.map((item) => [item[key], valueMapper(item)]));

            const statusMap = createMap(statuses, "id", (s) => s.name);
            const priorityMap = createMap(priorities, "id", (p) => p.name);
            const categoryMap = createMap(categories, "id", (c) => c.name);
            const userMap = createMap(users, "id", (u) => ({ name: u.name, email: u.email }));
            const machineMap = createMap(machines, "id", (m) => m.name);
            const productionPhaseMap = createMap(productionPhases, "id", (p) => p.name);
            const assignedTasksMap = assignedTasks.reduce((acc, task) => {
                (acc[task.incident_id] ||= []).push({
                    id: task.id,
                    assigned_user_id: task.assigned_user_id,
                    company_id: task.company_id,
                    assignment_date: task.assignment_date,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt
                });
                return acc;
            }, {});

            // Construcción de la respuesta final optimizada
            const incidentsWithDetails = incidents.map((incident) => ({
                id: incident.id,
                title: incident.title,
                description: incident.description,
                status: { id: incident.status_id, name: statusMap[incident.status_id] || "Unknown" },
                priority: { id: incident.priority_id, name: priorityMap[incident.priority_id] || "Unknown" },
                category: { id: incident.category_id, name: categoryMap[incident.category_id] || "Unknown" },
                user: userMap[incident.user_id] || { name: "Unknown", email: "" },
                machine: { id: incident.machine_id, name: machineMap[incident.machine_id] || "Unknown" },
                production_phase: { id: incident.production_phase_id, name: productionPhaseMap[incident.production_phase_id] || "Unknown" },
                company: { id: company?.id, name: company?.name || "Unknown" },
                creation_date: incident.creation_date,
                update_date: incident.update_date,
                assigned_tasks: assignedTasksMap[incident.id] || []
            }));

            return incidentsWithDetails.sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error("Error fetching incidents by company:", error);
            throw new Error("Failed to fetch incidents");
        }
    }
};
