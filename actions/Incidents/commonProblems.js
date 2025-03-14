"use strict";

module.exports = {
    async getCommonProblemsPercentage(ctx) {
        try {
            const { companyId } = ctx.params;

            const result = await ctx.call("incidents.getIncidentsByCompany", { companyId });

            const categoryCounts = {};
            let totalIncidents = 0;

            result.forEach(incident => {
                const categoryId = incident.category_id;

                if (!categoryCounts[categoryId]) {
                    categoryCounts[categoryId] = 0;
                }

                categoryCounts[categoryId]++;
                totalIncidents++;
            });

            const categoryPercentages = Object.keys(categoryCounts).map(categoryId => {
                return {
                    categoryId: parseInt(categoryId),
                    percentage: (categoryCounts[categoryId] / totalIncidents) * 100
                };
            });

            return { categoryPercentages };

        } catch (error) {
            console.error("Error fetching common problems percentage:", error);
            return { success: false, message: "Failed to fetch common problems percentage" };
        }
    }
};