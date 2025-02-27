"use strict";

module.exports = {
    async createIncidentHistory(ctx) {
        const { incident_id, previous_status_id, new_status_id, user_id, company_id, comment } = ctx.params;

        const history = await this.adapter.insert({
            incident_id,
            previous_status_id,
            new_status_id,
            comment,
            user_id,
            company_id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return history;
    }
};