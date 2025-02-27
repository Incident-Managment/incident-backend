"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const MachinesModel = require("../models/machines.model");
const getMachinesAction = require("../actions/machines/getMachines");
const getMachinesByCompanyAction = require("../actions/machines/getMachinesByCompany");
const createMachinesAction = require("../actions/machines/createMachines");
module.exports = {
    name: "machines",
    mixins: [DbService],
    adapter: adapter,
    model: MachinesModel,
    settings: {
        fields: ["id", "name", "type_id", "company_id"]
    },
    actions: {
        getMachinesGlobal: getMachinesAction.getMachinesGlobal,
        getMachinesByCompany: getMachinesByCompanyAction.getMachinesByCompany,
        createMachines: createMachinesAction.createMachines
    }
};