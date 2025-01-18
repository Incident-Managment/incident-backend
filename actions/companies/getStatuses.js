"use strict";

module.exports = {
    async getStatusesByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        try {
            const statuses = await this.adapter.find({ query: { company_id: companyId } });
            return statuses;
        } catch (error) {
            console.error("Error fetching statuses by company:", {
                message: error.message,
                stack: error.stack,
                companyId: companyId
            });
            if (error.message.includes("Service unavailable")) {
                ctx.meta.$statusCode = 503;
                throw new Error("ServiceUnavailableError: Service unavailable");
            }
            ctx.meta.$statusCode = 500;
            throw new Error("Failed to fetch statuses by company");
        }
    }
};