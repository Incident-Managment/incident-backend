"use strict";
const { Op } = require("sequelize");

module.exports = {
    async countIncidentsByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Tijuana",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const now = new Date();
        const [month, day, year] = formatter.formatToParts(now)
            .filter(part => part.type === "month" || part.type === "day" || part.type === "year")
            .map(part => part.value);

        const today = new Date(`${year}-${month}-${day}T00:00:00-08:00`);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        console.log("Today (America/Tijuana):", today);
        console.log("Tomorrow (America/Tijuana):", tomorrow);

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