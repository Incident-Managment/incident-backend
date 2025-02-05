"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getProductionPhasesByCompanyIdAction = require("../actions/companies/getProductionPhases");
const productionPhasesModel = require("../models/production_phases.model");
const updateProductionPhase = require("../actions/companies/updateProductionPhase");

module.exports = {
    name: "production_phases",
    mixins: [DbService],
    adapter: adapter,
    model: productionPhasesModel,
    settings: {
        fields: ["id", "name", "phase_order", "company_id", "is_active", "creation_date"],
    },
    actions: {
        updateProductionPhase: updateProductionPhase.updateProductionPhase,
        getProductionPhasesByCompany: getProductionPhasesByCompanyIdAction.getProductionPhasesByCompany,
    }
};