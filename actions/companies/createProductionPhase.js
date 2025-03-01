"use strict";

module.exports = {
    async createProductionPhase(ctx) {
        const { name, phase_order, company_id, is_active } = ctx.params;

        if (!name) {
            throw new Error("Name is required");
        }

        if (phase_order === undefined) {
            throw new Error("Phase order is required");
        }

        if (!company_id) {
            throw new Error("Company ID is required");
        }

        const existingPhases = await ctx.call("production_phases.find", {});

        const duplicatePhase = existingPhases.find(phase => phase.phase_order === phase_order && phase.company_id === company_id);
        if (duplicatePhase) {
            throw new Error(`A phase with phase_order ${phase_order} already exists for this company.`);
        }

        const newPhase = {
            name,
            phase_order,
            company_id,
            is_active: is_active !== undefined ? is_active : true
        };

        try {
            const result = await ctx.call("production_phases.create", newPhase);
            return result;
        } catch (error) {
            throw new Error(`Failed to create production phase: ${error.message}`);
        }
    }
};