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
                    folder: folder || "incidents", // Especifica la carpeta aquí
                    public_id: `incidents/${Date.now()}` // Especifica el public_id aquí
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

        // Inserta el incidente en la base de datos
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

        return incident;
    },
};