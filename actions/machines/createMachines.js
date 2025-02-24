"use strict";
module.exports = {
    async createMachines(ctx) {
        const machineData = ctx.params;
        try {
            const machine = await this.adapter.insert({
                name: machineData.name,
                description: machineData.description,
                type_id: machineData.type_id,
                company_id: machineData.company_id,
                creation_date: new Date(),
            });
            return machine;
        } catch (error) {
            console.error("Error creating machine:", error);
            throw error;
        }
    }
};