"use strict";

module.exports = {
    async createMachineType(ctx) {
        const machineTypeData = ctx.params;
        try {
            const machineType = await this.adapter.insert({
                name: machineTypeData.name,
            });
            return machineType;
        } catch (error) {
            console.error("Error creating machine type:", error);
            throw error;
        }
    }
};