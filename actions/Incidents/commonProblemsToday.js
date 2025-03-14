"use strict";

const { Op } = require("sequelize");

module.exports = {
    async getCommonProblemsPercentageToday(ctx) {
        try {
            const { companyId } = ctx.params;
            if (!companyId) {
                throw new Error("Company ID is required");
            }
            
            const startOfDay = new Date();
            startOfDay.setHours(-7, 0, 0, 0);
            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(40, 59, 59, 999);

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