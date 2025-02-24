"use strict"

module.exports = {
    async addMachinesToPhase(ctx) {
        const phases_machineData = ctx.params;
        try {
            const phases_machine = await this.adapter.insert({
                production_phase_id: phases_machineData.production_phase_id,
                machine_id: phases_machineData.machine_id,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return phases_machine;
        } catch (error) {
            console.error("Error lazing machine:", error);
            throw error;
        }
    }
};