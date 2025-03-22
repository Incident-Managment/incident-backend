"use strict";

module.exports = {
    async getIncidentsByStatusMonthly(ctx) {
        try {
            const { companyId } = ctx.params;

            const result = await ctx.call("incidents.getIncidentsByCompany", { companyId });

            // Mapeo de los índices de los meses a nombres
            const months = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];

            const incidentsData = {};

            result.forEach(incident => {
                const date = new Date(incident.creation_date);
                const year = date.getFullYear();
                const monthIndex = date.getMonth();
                const monthName = months[monthIndex]; // Nombre del mes
                const weekNumber = Math.ceil(date.getDate() / 7); // Número de semana en el mes
                const status = incident.status.name;

                // Inicializar estructuras si no existen
                if (!incidentsData[year]) {
                    incidentsData[year] = {};
                }

                if (!incidentsData[year][monthName]) {
                    incidentsData[year][monthName] = {
                        weekly: {},
                        monthly: {}
                    };
                }

                if (!incidentsData[year][monthName].weekly[weekNumber]) {
                    incidentsData[year][monthName].weekly[weekNumber] = {};
                }

                if (!incidentsData[year][monthName].monthly[status]) {
                    incidentsData[year][monthName].monthly[status] = 0;
                }

                if (!incidentsData[year][monthName].weekly[weekNumber][status]) {
                    incidentsData[year][monthName].weekly[weekNumber][status] = 0;
                }

                // Incrementar conteo
                incidentsData[year][monthName].monthly[status]++;
                incidentsData[year][monthName].weekly[weekNumber][status]++;
            });

            return { incidentsData };

        } catch (error) {
            console.error("Error fetching incidents by status weekly and monthly:", error);
            return { success: false, message: "Failed to fetch incidents by status weekly and monthly" };
        }
    }
};