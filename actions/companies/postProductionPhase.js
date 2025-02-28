"use strict";
module.exports = {
createProductionPhase:{
    params: {
        name: { type: "string", min: 2 ,required: true},
        phase_order: { type: "number", required: true },
        company_id: { type: "number" , required: true}
    },
    async handler(ctx) {
        const { Errors } = require("moleculer");
        try {
            const { phase_order, company_id, name } = ctx.params;
            const company = await ctx.call("companies.get", { id: company_id });
            if (!company || company.length === 0) {
                throw new Errors.MoleculerClientError("No company found", 404, "NOT_FOUND");
            }

            const existingPhase = await this.adapter.find({
                query: { phase_order: phase_order }
            });
            
            if (existingPhase.length > 0) {
                throw new Errors.MoleculerClientError("Phase order already exists", 400, "DUPLICATE_PHASE_ORDER");
            }

            return this.adapter.insert({
                name,
                phase_order,
                company_id
                
            });
        } catch (error) {
            console.error("Error creating production phase:", {
                message: error.message,
                stack: error.stack,
                params: ctx.params
            });
            if(error.message.includes("Phase order already exists")){
                ctx.meta.$statusCode = 400;
                throw new Errors.MoleculerClientError("Phase order already exists", 400, "DUPLICATE_PHASE_ORDER");
            }
            if (error.message.includes("Service unavailable")) {
                ctx.meta.$statusCode = 503;
                throw new Error("ServiceUnavailableError: Service unavailable");
            }

            ctx.meta.$statusCode = 500;
            throw new Errors.MoleculerClientError("Failed to create production phase", 500, "INTERNAL_ERROR");
        }
}
}};