"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const MachineType_Model = require("../models/machinetype_model");
const getRolesGlobalAction = require("../actions/machines/getMachine_Types");

module.exports = {
    name: "machine_types",
    mixins: [DbService],
    adapter: adapter,
    model: MachineType_Model,
    settings: {
        fields: ["id", "name"],
    },
    actions: {
        getMachineTypesGlobal: getRolesGlobalAction.getMachineTypesGlobal
    }
};