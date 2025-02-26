"use strict";

module.exports = {
    async updateIncidentByScan(ctx) {
        const { incident_id, scanned_machine_id } = ctx.params;

        const incident = await this.adapter.findOne({ where: { id: incident_id } });

        if (!incident) {
            throw new Error("Incidente no encontrado");
        }

        if (incident.machine_id !== scanned_machine_id) {
            throw new Error("El ID de la máquina escaneada no coincide con el incidente seleccionado");
        }

        const assignedTasks = await ctx.call("assigned_tasks.findAssignedTasksByIncidentId", { incident_id });

        if (!assignedTasks || assignedTasks.length === 0) {
            throw new Error("No hay tareas asignadas para este incidente");
        }

        const assignedTask = assignedTasks[0];

        if (assignedTask.assigned_user_id === incident.user_id) {
            throw new Error("El usuario asignado no puede ser el mismo que el creador de la incidencia");
        }

        let newStatus;
        let newStatusName;
        if (Number(incident.status_id) === 1) {
            newStatus = 2;
            newStatusName = "En Progreso";
        } else if (Number(incident.status_id) === 2) {
            newStatus = 3;
            newStatusName = "Resuelto";
        } else {
            console.error(`El incidente con ID ${incident_id} tiene un estado no válido: ${incident.status_id}`);
            throw new Error("El incidente no está en un estado válido y no puede ser actualizado.");
        }

        const updatedIncident = await this.adapter.updateById(incident_id, {
            $set: {
                status_id: newStatus,
                update_date: new Date(),
            },
        });

        await ctx.call("incident_status_history.createIncidentHistory", {
            incident_id: incident.id,
            previous_status_id: incident.status_id,
            new_status_id: newStatus,
            comment: `Se escaneó la incidencia y se cambió a status ${newStatusName}`,
            user_id: assignedTask.assigned_user_id,
            company_id: incident.company_id
        });

        console.log(`Incidente actualizado: ${JSON.stringify(updatedIncident)}`);

        return updatedIncident;
    },
};