"use strict";

module.exports = {
    async updateProductionPhase(ctx) {
        const { id, name, phase_order, is_active } = ctx.params;

        if (!id) {
            throw new Error("ID is required");
        }

        const existingPhases = await ctx.call("production_phases.find", {});

        if (phase_order !== undefined) {
            const duplicatePhase = existingPhases.find(phase => phase.phase_order === phase_order && phase.id !== id);
            if (duplicatePhase) {
                throw new Error(`Another phase with phase_order ${phase_order} already exists.`);
            }
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (phase_order !== undefined) updateData.phase_order = phase_order;
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