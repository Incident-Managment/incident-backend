"use strict";

module.exports = {
    async getMostCommonProblemsByCategory(ctx) {
        try {
            const { companyId } = ctx.params;

            const result = await ctx.call("incidents.getIncidentsByCompany", { companyId });

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
                const categoryId = incident.category.id;
                const categoryName = categories[categoryId];

                if (categoryName) {
                    categoryCounts[categoryName]++;
                }
            });

            const totalIncidents = result.length;
            const categoryPercentages = {};

            for (const [category, count] of Object.entries(categoryCounts)) {
                categoryPercentages[category] = {
                    count: count,
                    percentage: ((count / totalIncidents) * 100).toFixed(2)
                };
            }

            return categoryPercentages;

        } catch (error) {
            console.error("Error fetching most common problems by category:", error);
            return { success: false, message: "Failed to fetch most common problems by category" };
        }
    }
};