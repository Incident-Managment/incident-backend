"use strict";

module.exports = {
    async createComments(ctx) {
        const { incident_id, commentstechnique } = ctx.params;

        const incident = await this.adapter.findById(incident_id);
        if (!incident) {
            throw new Error("Incident not found");
        }

        try {
            let existingComments = incident.commentstechnique || [];

            if (!Array.isArray(existingComments)) {
                existingComments = [existingComments];
            }

            existingComments.push(commentstechnique);

            const updatedIncident = await this.adapter.updateById(incident_id, {
                $set: { commentstechnique: existingComments }
            });

            console.log("Incidente actualizado:", updatedIncident);

            return updatedIncident;
        } catch (error) {
            console.error("Error al actualizar el incidente:", error);
            throw new Error("Failed to create comment");
        }
    }
};
