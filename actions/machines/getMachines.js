"use strict";

module.exports = {
    getMachinesGlobal: {
        rest: "GET /machines",
        async handler(ctx) {
            const company_id = ctx.params.companyId;
            if (!company_id) {
                throw new Errors.ValidatorError("Company ID is required");
            }
            try {
                const machines = await this.adapter.find({
                    query: { company_id: Number(company_id) },
                    populate: ["type_id", "company_id", "production_phase_id"]
                });
                if (!machines || machines.length === 0) {
                    throw new Errors.MoleculerClientError("No machines found for the given company", 404, "NOT_FOUND");
                }

                const typeIds = [...new Set(machines.map(machine => machine.type_id))];
                const companyIds = [...new Set(machines.map(machine => machine.company_id))];
                const productionPhaseId = [...new Set(machines.map(machine => machine.production_phase_id))];

                const [types, companies, phases] = await Promise.all([
                    ctx.call("machine_types.find", { id: typeIds }),
                    ctx.call("companies.find", { id: companyIds }),
                    ctx.call("production_phases.find", { id: { $in: productionPhaseId }  }),
                ]);

                if (!types || types.length === 0) {
                    throw new Errors.MoleculerClientError("No machine types found", 404, "NOT_FOUND");
                }
                if (!companies || companies.length === 0) {
                    throw new Errors.MoleculerClientError("No companies found", 404, "NOT_FOUND");
                }
                if (!phases || phases.length === 0) {
                    throw new Errors.MoleculerClientError("No production phases found", 404, "NOT_FOUND");
                }

                const typeMap = types.reduce((acc, type) => {
                    acc[type.id] = type.name;
                    return acc;
                }, {});

                const companyMap = companies.reduce((acc, company) => {
                    acc[company.id] = company.name;
                    return acc;
                }, {});

                const phasesMap = phases.reduce((acc, phase) => {
                    acc[phase.id] = phase.name;
                    return acc;
                }, {});

                const machinesWithDetails = machines.map(machine => ({
                    id: machine.id,
                    name: machine.name,
                    type: {
                        id: machine.type_id,
                        name: typeMap[machine.type_id] || "Unknown Type"
                    },
                    company: {
                        id: machine.company_id,
                        name: companyMap[machine.company_id] || "Unknown Company"
                    },
                    production_phases: {
                        id: machine.production_phase_id,
                        name: phasesMap[machine.production_phase_id] || "Unknown Phase"
                    }
                }));

                return machinesWithDetails;
            } catch (error) {
            this.logger.error("Error fetching machines:", error);
    throw new Errors.MoleculerServerError("Failed to fetch machines", 500, "FETCH_ERROR");

            }
        }
    }
};
