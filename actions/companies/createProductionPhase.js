"use strict";

module.exports = {
    async createProductionPhase(ctx) {
        const { name, company_id, is_active } = ctx.params;

        if (!name) {
            throw new Error("Name is required");
        }

        if (!company_id) {
            throw new Error("Company ID is required");
        }

        const existingPhases = await ctx.call("production_phases.find", {});


        const newPhase = {
            name,
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