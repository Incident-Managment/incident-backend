"use strict";
module.exports = {
    updateMachine: {
        params: {
            id: { type: "string" },
            name: { type: "string", min: 2, optional: true }, 
            description: { type: "string", optional: true },  
            type_id: { type: "number", optional: true },  
            status: { type: "string", optional: true },  
            company_id: { type: "number", optional: true }, 
            production_phase_id: { type: "number", optional: true }  
        },
        async handler(ctx) {



            const { Errors } = require("moleculer");
            try {
                const { id, name, description, type_id, company_id, production_phase_id, status } = ctx.params;
                const machine = await this.adapter.findById(id);
                if (!machine) {
                    throw new Errors.MoleculerClientError("No machine found", 404, "NOT_FOUND");
                }

                // Se valida se este pasando una phase 
                if (production_phase_id) {
                    const phase = await ctx.call("production_phases.get", { id: production_phase_id });
                    if (!phase || phase.length === 0) {
                        throw new Errors.MoleculerClientError("No production phase found", 404, "NOT_FOUND");
                    }
                }
                // Preparar los datos para la actualización
                const updateData = {};

                if (name !== undefined) updateData.name = name;
                if (description !== undefined) updateData.description = description;
                if (type_id !== undefined) updateData.type_id = type_id;
                if (company_id !== undefined) updateData.company_id = company_id;
                if (status !== undefined) updateData.status = status;
                if (production_phase_id !== undefined) updateData.production_phase_id = production_phase_id;

                // Si no hay campos válidos para actualizar, lanzar un error
                if (Object.keys(updateData).length === 0) {
                    throw new Errors.MoleculerClientError("No valid fields to update", 400, "VALIDATION_ERROR");
                }

                // Realizar la actualización solo con los campos proporcionados
                return this.adapter.updateById(id, {
                    $set: updateData
                });

            } catch (error) {
                console.error("Error updating machine:", {
                    message: error.message,
                    stack: error.stack,
                    params: ctx.params
                });
                if (error.name === 'EntityNotFoundError') {
                    throw new Errors.MoleculerClientError("No machine found", 404, "NOT_FOUND");
                }
                if (error.message.includes("Service unavailable")) {
                    ctx.meta.$statusCode = 503;
                    throw new Error("ServiceUnavailableError: Service unavailable");
                }
                ctx.meta.$statusCode = 500;
                throw new Errors.MoleculerClientError("Failed to update machine", 500, "INTERNAL_ERROR");
            }
        }
    }
};