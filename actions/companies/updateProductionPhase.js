"use strict";

module.exports = {
    async updateProductionPhase(ctx) {
        const { id, name, is_active } = ctx.params;

        if (!id) {
            throw new Error("ID is required");
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (is_active !== undefined) updateData.is_active = is_active;

        try {
            const result = await ctx.call("production_phases.update", {
                id,
                $set: updateData
            });
            return result;
        } catch (error) {
            throw new Error(`Failed to update production phase: ${error.message}`);
        }
    }
};