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
        } = ctx.params;

        let image_cloudinary = null;

        if (imagePath) {
            try {
                // Leer el archivo de imagen como un Buffer
                const fs = require('fs');
                const fileBuffer = fs.readFileSync(imagePath);
                this.logger.info("File read successfully:", imagePath);

                // Subir la imagen a Firebase Storage
                const filename = `incidents/${Date.now()}`;
                this.logger.info("Uploading file to Firebase Storage with filename:", filename);

                const uploadResult = await ctx.call("storageService.uploadImage", {
                    file: fileBuffer,
                    filename: filename
                });
                this.logger.info("Upload result:", uploadResult);

                image_cloudinary = {
                    secure_url: uploadResult.url, // URL pública de Firebase Storage
                    public_id: filename // ID público para gestión futura
                };
            } catch (err) {
                this.logger.error("Error al subir la imagen:", err);
                throw new Error("Error al subir la imagen a Firebase Storage");
            }
        }

        const now = new Date();
        now.setHours(now.getHours() - 7);

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
            image_cloudinary: image_cloudinary || { secure_url: "https://example.com/default/incidents.jpg", public_id: "incidents/default" }, // Asegúrate de que no sea null
            creation_date: now,
            update_date: now,
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