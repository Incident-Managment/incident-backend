"use strict";
const { Op } = require("sequelize");

module.exports = {
    async incidentEfficiencyByCompany(ctx) {
        const companyId = parseInt(ctx.params.companyId, 10);
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = new Date();
        today.setHours(today.getHours() - 25);
        today.setMinutes(0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setHours(23, 59, 59, 999);

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