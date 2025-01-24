"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getIncidentsByCompanyIdAction = require("../actions/Incidents/getIncidentsByCompany.js");
const incidentsModel = require("../models/incidents.model");

module.exports = {
    name: "incidents",
    mixins: [DbService],
    adapter: adapter,
    model: incidentsModel,
    settings: {
        fields: ["id", "title", "description", "status_id", "priority_id", "category_id", "user_id", "machine_id", "company_id", "production_phase_id", "creation_date", "update_date"],
    },
    actions: {
        getIncidentsByCompany: getIncidentsByCompanyIdAction.getIncidentsByCompany
    }
};