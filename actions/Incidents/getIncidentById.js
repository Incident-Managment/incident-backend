"use strict";

module.exports = {
    async getIncidentById(ctx) {
        const incidentId = ctx.params.incidentId;
        if (!incidentId) {
            throw new Error("Incident ID is required");
        }

        console.log(`Fetching incident with ID: ${incidentId}`);

        try {
            const incident = await this.adapter.findOne({ where: { id: incidentId } });
            if (!incident) {
                throw new Error("Incident not found");
            }

            console.log(`Incident found: ${JSON.stringify(incident)}`);

            const statusId = incident.status_id;
            const priorityId = incident.priority_id;
            const categoryId = incident.category_id;
            const userId = incident.user_id;
            const machineId = incident.machine_id;
            const productionPhaseId = incident.production_phase_id;

            const [status, priority, category, user, machine, productionPhase, company] = await Promise.all([
                ctx.call("statuses.find", { id: statusId }),
                ctx.call("priorities.get", { id: priorityId }),
                ctx.call("categories.get", { id: categoryId }),
                ctx.call("users.find", { id: userId }),
                ctx.call("machines.find", { id: machineId }),
                ctx.call("production_phases.get", { id: productionPhaseId }),
                ctx.call("companies.find", { id: incident.company_id })
            ]);

            const incidentWithDetails = {
                id: incident.id,
                title: incident.title,
                description: incident.description,
                status: {
                    id: incident.status_id,
                    name: status.name
                },
                priority: {
                    id: incident.priority_id,
                    name: priority.name
                },
                category: {
                    id: incident.category_id,
                    name: category.name
                },
                user: {
                    id: incident.user_id,
                    name: user.name,
                    email: user.email
                },
                machine: {
                    id: incident.machine_id,
                    name: machine.name
                },
                production_phase: {
                    id: incident.production_phase_id,
                    name: productionPhase.name
                },
                company: {
                    id: company.id,
                    name: company.name
                },
                creation_date: incident.creation_date,
                update_date: incident.update_date
            };

            console.log(`Incident with details: ${JSON.stringify(incidentWithDetails)}`);

            return incidentWithDetails;
        } catch (error) {
            console.error("Error fetching incident by ID:", error);
            throw new Error(`Failed to fetch incident: ${error.message}`);
        }
    }
};