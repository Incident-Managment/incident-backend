"use strict";
const { Op } = require("sequelize");

module.exports = {
    async countIncidentsByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setUTCHours(23, 59, 59, 999);

        try {
            const count = await this.adapter.count({
                query: {
                    company_id: companyId,
                    creation_date: {
                        [Op.between]: [today, tomorrow]
                    }
                }
            });
            return { count };
        } catch (error) {
            console.error("Error counting incidents by company:", error);
            throw new Error("Failed to count incidents");
        }
    }
};