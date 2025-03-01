"use strict";

module.exports = {
    async createIncident(ctx) {
        const {
            title,
            description,
            status_id,
            priority_id,
            category_id,
            user_id,
            machine_id,
            company_id,
            production_phase_id,
            imagePath,
            folder,
        } = ctx.params;

        let image_cloudinary = null;

        if (imagePath) {
            try {
                const uploadResult = await ctx.call("cloudinary.upload", {
                    imagePath,
                    folder: "Incidents", // Explicitly set the folder to "Incidents"
                    public_id: `incidents/${Date.now()}`
                });

                image_cloudinary = {
                    secure_url: uploadResult.url, // URL segura de Cloudinary
                    public_id: uploadResult.public_id, // ID público para gestión futura
                };
            } catch (err) {
                this.logger.error("Error al subir la imagen:", err);
                throw new Error("Error al subir la imagen a Cloudinary");
            }
        }

        const incident = await this.adapter.insert({
            title,
            description,
            status_id,
            priority_id,
            category_id,
            user_id,
            machine_id,
            company_id,
            production_phase_id,
            image_cloudinary: image_cloudinary || { secure_url: "https://res.cloudinary.com/demo/image/upload/v1234567890/default/incidents.jpg", public_id: "incidents/default" }, // Asegúrate de que no sea null
            creation_date: new Date(),
            update_date: new Date(),
        });

        try {
            await ctx.call("incident_status_history.createIncidentHistory", {
                incident_id: incident.id,
                previous_status_id: null, // Proporciona un valor predeterminado para previous_status_id
                new_status_id: status_id,
                comment: "Se creó una incidencia y se puso en status En Espera",
                user_id,
                company_id
            });
        } catch (err) {
            this.logger.error("Error al crear el historial de la incidencia:", err);
            throw new Error("Error al crear el historial de la incidencia");
        }

        return incident;
    },
};