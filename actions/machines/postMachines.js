module.exports = {
    createMachine: {
    params: {
        name: { type: "string", min: 2 ,required: true},
        description: { type: "string", required: true },
        status: { type: "string", required: true},
        type_id: { type: "number" , required: true},
        company_id: { type: "number" , required: true},
        production_phase_id: { type: "number", required: true },
    },
    async handler(ctx) {
        const { Errors } = require("moleculer");

        try{ 
        
        console.log("---------------------", this.params);
        const { name, description, type_id, company_id, production_phase_id , status} = ctx.params;
        
        const phase= await  ctx.call("production_phases.get", { id:  production_phase_id });
        if (!phase || phase.length === 0) {
            throw new Errors.MoleculerClientError("No production phase found", 404, "NOT_FOUND");
        }

        return this.adapter.insert({
            name,
            description,
            status, 
            type_id,
            company_id,
            production_phase_id,       
            creation_date: new Date()
        });
    }catch (error) {
        console.error("Error creating machine:", {
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
        ctx.meta.$statusCode = 500;
        throw new Errors.MoleculerClientError("Failed to create machine", 500, "INTERNAL_ERROR");

        }
        }
    }
};