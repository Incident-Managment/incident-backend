"use strict";

module.exports = {
    async getStatuses(ctx) {
        try {
            const statuses = await this.adapter.find({});
            return statuses;
        } catch (error) {
            console.error("Error fetching statuses:", {
                message: error.message,
                stack: error.stack
            });
            if (error.message.includes("Service unavailable")) {
                ctx.meta.$statusCode = 503;
                throw new Error("ServiceUnavailableError: Service unavailable");
            }
            ctx.meta.$statusCode = 500;
            throw new Error("Failed to fetch statuses");
        }
    }
};