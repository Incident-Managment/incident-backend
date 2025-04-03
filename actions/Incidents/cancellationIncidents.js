"use strict";

module.exports = {
    async cancelIncident(ctx) {
        const { incident_id, comments, user_id } = ctx.params;

        try {
            const incident = await this.adapter.findOne({ id: incident_id});

            if (!incident) {
                throw new Error("Incident not found");
            }

            const now = new Date();
            now.setHours(now.getHours() - 7);

            const updatedIncident = await this.adapter.updateById(incident_id, {
                $set: {
                    status_id: 4,
                    update_date: now
                },
                $push: {
                    comments: {
                        user_id,
                        comment: comments,
                        date: now
                    }
                }
            });

            await ctx.call("incident_status_history.createIncidentHistory", {
                incident_id: incident_id,
                previous_status_id: incident.status_id,
                new_status_id: 4,
                comment: comments,
                user_id,
                company_id: incident.company_id
            });

            ctx.emit("incident.cancelled", { incident: updatedIncident });
            this.logger.info("Incidencia cancelada con éxito:", updatedIncident);

            return updatedIncident;
        } catch (err) {
            this.logger.error("Error al cancelar la incidencia:", err);
            throw new Error("Error al cancelar la incidencia");
        }
    }
};