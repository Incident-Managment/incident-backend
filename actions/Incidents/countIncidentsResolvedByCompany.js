"use strict";

module.exports = {
    async countIncidentsResolvedByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        try {
            const count = await this.adapter.count({ query: { company_id: companyId, status_id: 3 } });
            return { count };
        } catch (error) {
            console.error("Error counting resolved incidents by company:", error);
            throw new Error("Failed to count resolved incidents");
        }
    }
};