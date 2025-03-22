"use strict";

module.exports = {
    async getMachinesByCompany(ctx) {
        try {
            const companyId = ctx.params.companyId;
            if (!companyId) {
                throw new Error("Company ID is required");
            }
            const machines = await this.adapter.find({
                query: { company_id: companyId },
                populate: ["type_id", "company_id"]
            });

            const typeIds = [...new Set(machines.map(machine => machine.type_id))];
            const companyIds = [...new Set(machines.map(machine => machine.company_id))];

            const [types, companies] = await Promise.all([
                ctx.call("machine_types.findMachineTypes", { id: typeIds }),
                ctx.call("companies.find", { id: companyIds })
            ]);

            const typeMap = types.reduce((acc, type) => {
                acc[type.id] = type.name;
                return acc;
            }, {});

            const companyMap = companies.reduce((acc, company) => {
                acc[company.id] = company.name;
                return acc;
            }, {});

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
                }
            }));

            return machinesWithDetails;
        } catch (error) {
            console.error("Error fetching machines by company:", error);
            throw new Error("Failed to fetch machines");
        }
    }
};