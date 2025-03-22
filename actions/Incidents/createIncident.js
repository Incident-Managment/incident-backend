"use strict";

const fs = require('fs');
const path = require('path');

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
            creation_date,
            update_date,
            production_phase_id,
            imagePath
        } = ctx.params;

        let image_cloudinary = null;

        if (imagePath) {
            try {
                const fileBuffer = fs.readFileSync(imagePath);
                const filename = `incidents/${Date.now()}`;
                
                const uploadResult = await ctx.call("storageService.uploadImage", {
                    file: fileBuffer,
                    filename: filename
                });

                image_cloudinary = {
                    secure_url: uploadResult.url,
                    public_id: filename
                };
            } catch (err) {
                this.logger.error("Error al subir la imagen:", err);
                throw new Error("Error al subir la imagen a Firebase Storage");
            }
        }

        const now = new Date();
        now.setHours(now.getHours() - 7);

        try {
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
                image_cloudinary: image_cloudinary || { secure_url: "https://example.com/default/incidents.jpg", public_id: "incidents/default" },
                creation_date: creation_date || now,
                update_date: update_date || now,
            });

            await ctx.call("incident_status_history.createIncidentHistory", {
                incident_id: incident.id,
                previous_status_id: null,
                new_status_id: status_id,
                comment: "Se creó una incidencia y se puso en status En Espera",
                user_id,
                company_id
            });

            ctx.emit("incident.created", { incident });
            this.logger.info("Incidencia creada con éxito:", incident);
            
            setImmediate(async () => {
                try {
                    const users = await ctx.call("users.getUsersGlobal");
                    const filteredUsers = users.filter(user => user.role.id === 2 && user.company.id === company_id);
                    const templatePath = path.join(__dirname, '../../templates/notificationToSupervisor.html');
                    let template = fs.readFileSync(templatePath, 'utf8');

                    template = template.replace('{{title}}', title)
                                       .replace('{{description}}', description)
                                       .replace('{{user_id}}', user_id)
                                       .replace('{{machine_id}}', machine_id)
                                       .replace('{{category_id}}', category_id)
                                       .replace('{{production_phase_id}}', production_phase_id)
                                       .replace('{{priority_id}}', priority_id)
                                       .replace('{{status_id}}', status_id)
                                       .replace('{{creation_date}}', creation_date || now)
                                       .replace('{{update_date}}', update_date || now);

                    for (const user of filteredUsers) {
                        const emailParams = {
                            to: user.email,
                            subject: 'Notificación de Incidencia',
                            html: template
                        };
                        await ctx.call("emailService.sendIncidentNotification", emailParams);
                        this.logger.info(`Correo enviado a: ${user.email}`);
                    }
                } catch (err) {
                    this.logger.error("Error al enviar correos:", err);
                }
            });

            return incident;
        } catch (err) {
            this.logger.error("Error al crear la incidencia:", err);
            throw new Error("Error al crear la incidencia");
        }
    },
};
