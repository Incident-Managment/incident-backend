"use strict";

module.exports = {
        async updateProductionPhase(ctx) {
            const { Errors } = require("moleculer");
            try {
                const { id, name, phase_order, company_id, is_active } = ctx.params;

                
                const company = await ctx.call("companies.get", { id: company_id });
                if (!company || company.length === 0) {
                    throw new Errors.MoleculerClientError("No company found", 404, "NOT_FOUND");
                }
                const existingPhase = await this.adapter.find({ 
                    query: { 
                        phase_order: phase_order
                    } 
                });
                if (existingPhase.length > 0 && existingPhase[0].id !== id) {
                    throw new Errors.MoleculerClientError("Phase order already exists", 400, "DUPLICATE_PHASE_ORDER");  
                }

                return this.adapter.updateById(id, {
                    $set : {
                        name,
                        phase_order,
                        company_id,
                        is_active
                    }
                });
            } catch (error) {
                console.error("Error updating production phase:", {
                    message: error.message,
                    stack: error.stack,
                    params: ctx.params
                });
                if (error.name === 'EntityNotFoundError') {
                    throw new Errors.MoleculerClientError("No production phase found", 404, "NOT_FOUND");
                }
                if (error.message.includes("Service unavailable")) {
                    ctx.meta.$statusCode = 503;
                    throw new Error("ServiceUnavailableError: Service unavailable");
                }
                if(error.message.includes("Phase order already exists")){
                    ctx.meta.$statusCode = 400;
                    throw new Errors.MoleculerClientError("Phase order already exists", 400, "DUPLICATE_PHASE_ORDER");
                }
                ctx.meta.$statusCode = 500;
                throw new Errors.MoleculerClientError("Failed to update production phase", 500, "INTERNAL_ERROR");
            }
        }
    };