"use strict"

module.exports = {
    async find(ctx) {
        const query = ctx.params.query || {};
        try {
            const assignedTasks = await this.adapter.find({ query });
            return assignedTasks;
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
            throw new Error("Failed to fetch assigned tasks");
        }
    }
};