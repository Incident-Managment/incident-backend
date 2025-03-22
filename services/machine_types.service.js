"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const MachineType_Model = require("../models/machinetype_model");
const getRolesGlobalAction = require("../actions/machines/getMachine_Types");
const createMachineTypeAction = require("../actions/machines/createMachineType");
module.exports = {
    name: "machine_types",
    mixins: [DbService],
    adapter: adapter,
    model: MachineType_Model,
    settings: {
        fields: ["id", "name"],
    },
    actions: {
        getMachineTypesGlobal: getRolesGlobalAction.getMachineTypesGlobal,
        createMachineType: createMachineTypeAction.createMachineType,
        findMachineTypes: {
            async handler(ctx) {
                try {
                    const machineTypes = await this.adapter.find();
                    return machineTypes;
                } catch (error) {
                    console.error("Error finding machine types:", error);
                    throw error;
                }
            }
        }
    }
};