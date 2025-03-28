module.exports = {
    async getMachinesByCompany(ctx) {
        try {
            const companyId = ctx.params.companyId;
            if (!companyId) {
                throw new Error("Company ID is required");
            }

            // Obtener todas las máquinas de la empresa
            const machines = await this.adapter.find({
                query: { company_id: companyId },
                populate: ["type_id", "company_id"]
            });

            // Obtener los IDs únicos de los tipos, empresas, fases de producción y máquinas
            const typeIds = [...new Set(machines.map(machine => machine.type_id))];
            const companyIds = [...new Set(machines.map(machine => machine.company_id))];
            const productionPhaseId = [...new Set(machines.map(machine => machine.production_phase_id))];
            const machineIds = [...new Set(machines.map(machine => machine.id))];

            // Obtener los incidentes de todas las máquinas, filtrando por machine_id
            const incidents = await ctx.call("incidents.find", { where: { machine_id: { $in: machineIds } } });

            // Obtener los detalles de los tipos, empresas y fases de producción
            const [types, companies, phases] = await Promise.all([
                ctx.call("machine_types.find", { id: typeIds }),
                ctx.call("companies.find", { id: companyIds }),
                ctx.call("production_phases.find", { id: { $in: productionPhaseId } })
            ]);

            const typeMap = types.reduce((acc, type) => {
                acc[type.id] = type.name;
                return acc;
            }, {});

            const companyMap = companies.reduce((acc, company) => {
                acc[company.id] = company.name;
                return acc;
            }, {});

            const phasesMap = phases.reduce((acc, phase) => {
                acc[phase.id] = phase.name;
                return acc;
            }, {});

            // Asignar los detalles a cada máquina, incluida la última incidencia
            const machinesWithDetails = machines.map(machine => {
                // Filtrar los incidentes específicos para cada máquina
                const machineIncidents = incidents.filter(incident => incident.machine_id === machine.id);

                // Obtener el último incidente, si existe
                const lastIncident = machineIncidents.length > 0 ? {
                    countIncidents: machineIncidents.length,
                    description: machineIncidents[0].description,
                    creation_date: machineIncidents[0].creation_date,  // Aquí asignas el primer incidente (o el más reciente)
                } : null;

                return {
                    id: machine.id,
                    name: machine.name,
                    status: machine.status || "Unknown Status",
                    description: machine.description || "No description",
                    Details: {
                        type_id: machine.type_id,
                        type_name: typeMap[machine.type_id] || "Unknown Type"
                    },
                    company: {
                        id: machine.company_id,
                        name: companyMap[machine.company_id] || "Unknown Company"
                    },
                    production_phases: {
                        id: machine.production_phase_id,
                        name: phasesMap[machine.production_phase_id] || "Unknown Phase",
                    },
                    creation_date: machine.creation_date,
                    // Asignando el incidente específico de la máquina
                    last_Incident: lastIncident,
                };
            });

            return machinesWithDetails;
        } catch (error) {
            console.error("Error fetching machines by company:", error);
            throw new Error("Failed to fetch machines");
        }
    }
};
