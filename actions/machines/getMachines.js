"use strict";

module.exports = {
    getMachinesGlobal: {
        rest: "GET /machines",
        async handler(ctx) {
            try {
                const machines = await this.adapter.find({
                    populate: ["type_id", "company_id", "production_phase_id"]
                });
                console.log("machines ++++++++++++-------------------------++++++++++++++++++++", machines);
                const typeIds = [...new Set(machines.map(machine => machine.type_id))];
                const companyIds = [...new Set(machines.map(machine => machine.company_id))];
                const productionPhaseId = [...new Set(machines.map(machine => machine.production_phase_id))];
                console.log("productionPhaseId ++++++++++++-------------------------++++++++++++++++++++", productionPhaseId);
                const [types, companies, phases] = await Promise.all([
                    ctx.call("machine_types.find", { id: typeIds }),
                    ctx.call("companies.find", { id: companyIds }),
                    ctx.call("production_phases.find", { id: { $in: productionPhaseId }  }),
                ]);

                console.log("phases ++++++++++++-------------------------++++++++++++++++++++", phases);
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

                console.log("phasesMap ++++++++++++-------------------------++++++++++++++++++++", phasesMap);

                const machinesWithDetails = machines.map(machine => ({
                    id: machine.id,
                    name: machine.name,
                    type: {
                        id: machine.type_id,
                        name: typeMap[machine.type_id]
                    },
                    company: {
                        id: machine.company_id,
                        name: companyMap[machine.company_id]
                    },
                    production_phases: {
                        id: machine.production_phase_id,
                        name: phasesMap[machine.production_phase_id]
                    }
                }));

                return machinesWithDetails;
            } catch (error) {
                throw new Error("Failed to fetch machines");
            }
        }
    }
};
