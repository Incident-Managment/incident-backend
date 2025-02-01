"use strict";

module.exports = {
    async getMachinesByCompany(ctx) {
        try {
            const companyId = ctx.params.companyId;
            if (!companyId) {
                throw new Error("Company ID is required");
            }
            const machines = await this.adapter.find({ query: { company_id: companyId } });
            return machines;
        } catch (error) {
            console.error("Error fetching machines by company:", error);
            throw new Error("Failed to fetch machines");
        }
    }
};