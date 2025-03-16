"use strict";

module.exports = {
    async getIncidentStatusHistory(ctx) {
        const incidentId = ctx.params.incidentId;
        if (!incidentId) {
            throw new Error("Incident ID is required");
        }

        try {
            const statusHistory = await this.adapter.find({ query: { incident_id: incidentId } });

            const statusIds = [...new Set(statusHistory.flatMap(history => [history.previous_status_id, history.new_status_id]))];
            const userIds = [...new Set(statusHistory.map(history => history.user_id))];

            const [statuses, users] = await Promise.all([
                ctx.call("statuses.find", { id: statusIds }),
                ctx.call("users.find", { id: userIds })
            ]);

            const statusMap = statuses.reduce((acc, status) => {
                acc[status.id] = status.name;
                return acc;
            }, {});

            const userMap = users.reduce((acc, user) => {
                acc[user.id] = { name: user.name, email: user.email };
                return acc;
            }, {});

            const statusHistoryWithDetails = statusHistory.map(history => ({
                id: history.id,
                incident_id: history.incident_id,
                previous_status: {
                    id: history.previous_status_id,
                    name: statusMap[history.previous_status_id]
                },
                new_status: {
                    id: history.new_status_id,
                    name: statusMap[history.new_status_id]
                },
                comment: history.comment,
                user: {
                    id: history.user_id,
                    name: userMap[history.user_id].name,
                    email: userMap[history.user_id].email
                },
                company_id: history.company_id,
                createdAt: history.createdAt,
                updatedAt: history.updatedAt
            }));

            statusHistoryWithDetails.sort((a, b) => a.id - b.id);

            return statusHistoryWithDetails;
        } catch (error) {
            console.error("Error fetching incident status history:", error);
            throw new Error("Failed to fetch incident status history");
        }
    }
};
