"use strict";

module.exports = {
    async getMachinesByPhase(ctx) {
        const { phase_id, company_id } = ctx.params;

        try {
            const phases_machines = await this.adapter.db.query(
                "SELECT DISTINCT pm.production_phase_id, p.name AS phase_name, pm.machine_id, m.name AS machine_name " +
                "FROM phases_machines pm " +
                "JOIN production_phases p ON pm.production_phase_id = p.id " +
                "JOIN machines m ON pm.machine_id = m.id " +
                "WHERE pm.production_phase_id = :phase_id AND p.company_id = :company_id AND m.company_id = :company_id",
                {
                    replacements: { phase_id, company_id },
                    type: this.adapter.db.QueryTypes.SELECT
                }
            );

            return phases_machines.map(machine => ({
                production_phase_id: machine.production_phase_id,
                phase_name: machine.phase_name,
                machine_id: machine.machine_id,
                machine_name: machine.machine_name
            }));
        } catch (error) {
            console.error("Error fetching machines by phase:", error);
            throw new Error("Failed to fetch machines by phase");
        }
    }
};
