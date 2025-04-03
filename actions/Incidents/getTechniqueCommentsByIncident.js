"use strict";

module.exports = {
    async getTechniqueCommentsByIncident(ctx) {
        const { incidentId } = ctx.params;

        const incident = await this.adapter.findById(incidentId);
        if (!incident) {
            throw new Error("Incident not found");
        }

        return incident.commentstechnique || [];
    }
};