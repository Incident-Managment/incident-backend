"use strict";
const { Op } = require("sequelize");

module.exports = {
    async countIncidentsResolvedByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = new Date();
        today.setHours(-7, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(40, 59, 59, 999);

        try {
            const count = await this.adapter.count({
                query: {
                    company_id: companyId,
                    status_id: 3,
                    creation_date: {
                        [Op.between]: [today, endOfDay]
                    }
                }
            });
            return { count };
        } catch (error) {
            console.error("Error counting resolved incidents by company:", error);
            throw new Error("Failed to count resolved incidents");
        }
    }
};