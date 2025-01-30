const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getPhasesMachine = require("../actions/companies/getPhases_Machine");
const PhasesMachineModel = require("../models/phasesMachine.model");

module.exports = {
    name: "phases_machines",
    mixins: [DbService],
    adapter: adapter,
    model: PhasesMachineModel,
    settings: {
        fields: ["id", "phase_id", "machine_id", "company_id"],
    },
    actions: {
        getPhasesMachine: getPhasesMachine.getPhasesMachine,
    }
};