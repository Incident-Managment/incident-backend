"use strict";

module.exports = {
    async MonthlyEvolution(ctx) {
        try {
            const { companyId } = ctx.params;

            const result = await ctx.call("incidents.getIncidentsByCompany", { companyId });

            const months = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];

            const incidentsData = {};

            result.forEach(incident => {
                const date = new Date(incident.creation_date);
                const monthIndex = date.getMonth();
                const monthName = months[monthIndex];
                const status = incident.status.name;

                if (!incidentsData[monthName]) {
                    incidentsData[monthName] = {
                        totalIncidents: 0,
                        totalResolved: 0
                    };
                }

                incidentsData[monthName].totalIncidents++;

                if (status === 'Resuelto') {
                    incidentsData[monthName].totalResolved++;
                }
            });

            return { incidentsData };

        } catch (error) {
            console.error("Error fetching incidents by status monthly:", error);
            return { success: false, message: "Failed to fetch incidents by status monthly" };
        }
    }
};