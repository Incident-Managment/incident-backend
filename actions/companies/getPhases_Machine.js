"use strict";

module.exports = {
    async getPhasesMachine(ctx) {
        const companyId = ctx.params.companyId;

        if (!companyId) {
            throw new Error("company_id is required");
        }

        try {
            const phases_machines = await this.adapter.find({ query: { company_id: companyId } });
            return phases_machines;
        } catch (error) {
            throw new Error("Error fetching phases_machines: " + error.message);
        }
    }
};