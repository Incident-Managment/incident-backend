"use strict";

module.exports = {
    async getMachinesByPhase(ctx) {
        const { phase_id } = ctx.params;

        const machines = await this.adapter.find({
            where: { production_phase_id: phase_id },
            include: [{
                model: this.models.Machine,
                as: 'machine'
            }]
        });

        if (!machines || machines.length === 0) {
            throw new Error("No se encontraron máquinas para la fase proporcionada");
        }

        return machines.map(machine => machine.machine);
    }
};