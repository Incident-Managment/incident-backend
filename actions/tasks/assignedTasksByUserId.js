"use strict";

module.exports = {
    async findAssignedTasksByUserId(ctx) {
        const userId = ctx.params.userId;
        if (!userId) {
            throw new Error("User ID is required");
        }

        const query = { assigned_user_id: userId };
        try {
            const assignedTasks = await this.adapter.find({ query });
            return assignedTasks;
        } catch (error) {
            console.error("Error fetching assigned tasks by user ID:", error);
            throw new Error("Failed to fetch assigned tasks by user ID");
        }
    }
};