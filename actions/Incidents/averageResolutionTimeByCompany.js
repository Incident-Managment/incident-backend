"use strict";

module.exports = {
    async averageResolutionTimeByCompany(ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("Company ID is required");
        }

        try {
            const incidents = await this.adapter.find({ query: { company_id: companyId, status_id: 3 } });
            if (incidents.length === 0) {
                return { averageResolutionTime: 0 };
            }

            const totalResolutionTime = incidents.reduce((total, incident) => {
                const creationDate = new Date(incident.creation_date);
                const updateDate = new Date(incident.update_date);
                const resolutionTime = (updateDate - creationDate) / (1000 * 60 * 60); // Convert milliseconds to hours
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