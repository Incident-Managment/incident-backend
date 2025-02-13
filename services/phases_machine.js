"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const phases_machineModel = require("../models/phases_machine.model");
const getMachinesByPhaseAction = require("../actions/companies/getMachinesByPhase");

module.exports = {
    name: "phases_machine",
    mixins: [DbService],
    adapter: adapter,
    model: phases_machineModel,
    actions: {
        getMachinesByPhase: getMachinesByPhaseAction.getMachinesByPhase
    }
};
