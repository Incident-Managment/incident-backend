"use strict";

module.exports = {
    async CreateAssignedTask(ctx) {
        const { incident_id, assigned_user_id, company_id, assignment_date } = ctx.params;

        const user = await this.broker.call("users.get", { id: assigned_user_id });
        if (user.role_id !== 4 || user.company_id !== 1) {
            throw new Error("Only users with role_id 4 and company_id 1 can be assigned tasks");
        }

        try {
            const newAssignedTask = await this.adapter.insert({
                incident_id,
                assigned_user_id,
                company_id,
                assignment_date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return newAssignedTask;
        } catch (error) {
            console.error("Error creating assigned task:", error);
            throw new Error("Failed to create assigned task");
        }
    }
};