"use strict";

module.exports = {
    async findAssignedTasks(ctx) {
        const query = ctx.params.query || {};
        try {
            const assignedTasks = await this.adapter.find({ query });

            const userIds = [...new Set(assignedTasks.map(task => task.assigned_user_id))];
            const users = await ctx.call("users.getUsersGlobal", { query: { id: userIds } });

            const userMap = users.reduce((acc, user) => {
                acc[user.id] = user.name;
                return acc;
            }, {});

            const tasksWithUserDetails = assignedTasks.map(task => ({
                id: task.id,
                assigned_user_id: task.assigned_user_id,
                assigned_user_name: userMap[task.assigned_user_id] || "Unknown User",
                incident_id: task.dataValues?.incident_id,
                company_id: task.dataValues?.company_id,
                assignment_date: task.dataValues?.assignment_date,
                createdAt: task.dataValues?.createdAt,
                updatedAt: task.dataValues?.updatedAt
            }));

            return tasksWithUserDetails;
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
            throw new Error("Failed to fetch assigned tasks");
        }
    }
};