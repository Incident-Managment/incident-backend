"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const phases_machineModel = require("../models/phasesMachine.model");
const getMachinesByPhaseAction = require("../actions/companies/getMachinesByPhase");
const addMachinesToPhaseAction = require("../actions/companies/addMachinesToPhase");
module.exports = {
    name: "phases_machine",
    mixins: [DbService],
    adapter: adapter,
    model: phases_machineModel,
    actions: {
        getMachinesByPhase: getMachinesByPhaseAction.getMachinesByPhase,
        addMachinesToPhase: addMachinesToPhaseAction.addMachinesToPhase
    }
};
