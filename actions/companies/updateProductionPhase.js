"use strict";

module.exports = {
    async updateProductionPhase (ctx) {
        const { companyId, phaseId, phase_order, name, is_active } = ctx.params;

        if (!companyId || !phaseId) {
            throw new Error("Company ID and Phase ID are required");
        }

        try {
            // Encuentra la fase de producción asociada a la compañía y el ID de fase proporcionados
            const existingPhase = await this.adapter.findOne({ 
                query: { company_id: companyId, id: phaseId } 
            });

            if (!existingPhase) {
                ctx.meta.$statusCode = 404;
                throw new Error("Production phase not found");
            }

            // Realiza la actualización en la base de datos
            const updatedPhase = await this.adapter.updateById(phaseId, {
                $set: { phase_order, name, is_active }
            });

            return { message: "Production phase updated successfully", updatedPhase };
        } catch (error) {
            console.error("Error updating production phase:", {
                message: error.message,
                stack: error.stack,
                companyId,
                phaseId
            });

            ctx.meta.$statusCode = error.message.includes("not found") ? 404 : 500;
            throw new Error("Failed to update production phase");
        }
    }
};
