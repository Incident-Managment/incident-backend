"use strict";

const { Op } = require("sequelize");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async getCommonProblemsPercentageToday(ctx) {
        try {
            const { companyId } = ctx.params;
            if (!companyId) {
                throw new Error("Company ID is required");
            }
            
        const startOfDay = dayjs().tz('America/Tijuana').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endOfDay = dayjs().tz('America/Tijuana').endOf('day').format('YYYY-MM-DD HH:mm:ss');
        console.log("Start of Day:", startOfDay);
        console.log("End of Day:", endOfDay);
        
            const result = await this.adapter.find({
                query: {
                    company_id: companyId,
                    creation_date: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                }
            });

            const categories = {
                1: "Mantenimiento",
                2: "Calidad", 
                3: "Producción"
            };

            const categoryCounts = {
                "Mantenimiento": 0,
                "Calidad": 0,
                "Producción": 0
            };

            result.forEach(incident => {
                const categoryId = incident.category_id;
                const categoryName = categories[categoryId];
                
                if (categoryName) {
                    categoryCounts[categoryName]++;
                }
            });

            const totalIncidents = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
            const categoryPercentages = {};

            for (const [category, count] of Object.entries(categoryCounts)) {
                categoryPercentages[category] = {
                    count: count,
                    percentage: totalIncidents > 0 ? ((count / totalIncidents) * 100).toFixed(2) : "0.00"
                };
            }

            return categoryPercentages;

        } catch (error) {
            console.error("Error fetching most common problems by category:", error);
            return { success: false, message: "Failed to fetch most common problems by category" };
        }
    }
};