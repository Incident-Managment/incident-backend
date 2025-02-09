"use strict";

module.exports = {
    async countIncidentsByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        try {
            const count = await this.adapter.count({ query: { company_id: companyId } });
            return { count };
        } catch (error) {
            console.error("Error counting incidents by company:", error);
            throw new Error("Failed to count incidents");
        }
    }
};