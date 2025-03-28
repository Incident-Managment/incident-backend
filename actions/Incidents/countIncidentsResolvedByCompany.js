"use strict";
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async countIncidentsResolvedByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = dayjs().tz('America/Tijuana').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endOfDay = dayjs().tz('America/Tijuana').endOf('day').format('YYYY-MM-DD HH:mm:ss');

        console.log("Today:", today);
        console.log("End of day:", endOfDay);
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