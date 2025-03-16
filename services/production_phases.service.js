"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getProductionPhasesByCompanyIdAction = require("../actions/companies/getProductionPhases");
const productionPhasesModel = require("../models/production_phases.model");
const updateProductionPhaseAction = require("../actions/companies/updateProductionPhase");
const createProductionPhaseAction = require("../actions/companies/createProductionPhase");
module.exports = {
    name: "production_phases",
    mixins: [DbService],
    adapter: adapter,
    model: productionPhasesModel,
    actions: {
        getProductionPhasesByCompany: getProductionPhasesByCompanyIdAction.getProductionPhasesByCompany,
        createProductionPhase: createProductionPhaseAction.createProductionPhase,
        updateProductionPhase: updateProductionPhaseAction.updateProductionPhase
    }
};