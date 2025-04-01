"use strict";
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async incidentEfficiencyByCompany(ctx) {
        const companyId = parseInt(ctx.params.companyId, 10);
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = dayjs().tz('America/Tijuana').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const tomorrow = dayjs().tz('America/Tijuana').endOf('day').format('YYYY-MM-DD HH:mm:ss');

        try {
            const allIncidents = await this.adapter.find({
                query: {
                    company_id: companyId,
                    creation_date: {
                        [Op.between]: [today, tomorrow]
                    }
                }
            });

            const incidents = allIncidents.filter(incident => incident.status_id !== 4);

            if (incidents.length === 0) {
                return { productionEfficiency: 0 };
            }

            const resolvedIncidents = incidents.filter(incident => incident.status_id === 3).length;
            const productionEfficiency = (resolvedIncidents / incidents.length) * 100;

            return { productionEfficiency };
        } catch (error) {
            throw new Error(`Failed to calculate production efficiency: ${error.message}`);
        }
    }
};