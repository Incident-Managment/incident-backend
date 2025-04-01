"use strict";
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async averageResolutionTimeByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = dayjs().tz('America/Tijuana').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const tomorrow = dayjs().tz('America/Tijuana').endOf('day').format('YYYY-MM-DD HH:mm:ss');

        try {
            const query = {
                company_id: companyId,
                status_id: 3,
                creation_date: {
                    [Op.between]: [today, tomorrow]
                }
            };

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