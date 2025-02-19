"use strict";

module.exports = {
    async getRecentIncidentsByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        try {
            const incidents = await this.adapter.find({
                query: { company_id: companyId },
                sort: "-creation_date",
                limit: 5
            });

            if (!incidents || incidents.length === 0) {
                throw new Error("No incidents found");
            }

            const detailedIncidents = await Promise.all(incidents.map(async (incident) => {
                const statusId = incident.status_id;
                const priorityId = incident.priority_id;
                const categoryId = incident.category_id;
                const userId = incident.user_id;
                const machineId = incident.machine_id;
                const productionPhaseId = incident.production_phase_id;

                const [status, priority, category, user, machine, productionPhase, company] = await Promise.all([
                    ctx.call("statuses.get", { id: statusId }),
                    ctx.call("priorities.get", { id: priorityId }),
                    ctx.call("categories.get", { id: categoryId }),
                    ctx.call("users.get", { id: userId }),
                    ctx.call("machines.get", { id: machineId }),
                    ctx.call("production_phases.get", { id: productionPhaseId }),
                    ctx.call("companies.get", { id: incident.company_id })
                ]);

                return {
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
            }));

            return detailedIncidents;
        } catch (error) {
            console.error("Error fetching incidents by company ID:", error);
            throw new Error(`Failed to fetch incidents: ${error.message}`);
        }
    }
};