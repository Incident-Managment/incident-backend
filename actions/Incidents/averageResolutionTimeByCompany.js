"use strict";
const { Op } = require("sequelize");

module.exports = {
    async averageResolutionTimeByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = new Date();
        today.setHours(today.getHours() - 25);
        today.setMinutes(0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setHours(23, 59, 59, 999);
        console.log("Today:", today);
        console.log("Tomorrow:", tomorrow);

        try {
            const query = {
                company_id: companyId,
                status_id: 3,
                creation_date: {
                    [Op.between]: [today, tomorrow]
                }
            };

            console.log("Query being executed:", query);

            const incidents = await this.adapter.find({ query });

            if (incidents.length === 0) {
                return { averageResolutionTime: 0 };
            }

            const totalResolutionTime = incidents.reduce((total, incident) => {
                const creationDate = new Date(incident.creation_date);
                const updateDate = new Date(incident.update_date);
                const resolutionTime = (updateDate - creationDate) / (1000 * 60 * 60);
                return total + resolutionTime;
            }, 0);

            const averageResolutionTime = totalResolutionTime / incidents.length;
            return { averageResolutionTime };
        } catch (error) {
            console.error("Error calculating average resolution time by company:", error);
            throw new Error("Failed to calculate average resolution time");
        }
    }
};