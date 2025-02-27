"use strict"

module.exports = {
    async findAssignedTasksByIncidentId(ctx) {
        const { incident_id } = ctx.params;
        if (!incident_id) {
            throw new Error("incident_id is required");
        }
        try {
            const assignedTasks = await this.adapter.find({ query: { incident_id } });
            return assignedTasks;
        } catch (error) {
            console.error("Error fetching assigned tasks by incident_id:", error);
            throw new Error("Failed to fetch assigned tasks by incident_id");
        }
    }
};
