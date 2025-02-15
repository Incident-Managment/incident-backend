"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getIncidentsByCompanyIdAction = require("../actions/Incidents/getIncidentsByCompany");
const createIncidentAction = require("../actions/Incidents/createIncident");
const countIncidentsByCompanyAction = require("../actions/Incidents/countIncidentsByCompany");
const countIncidentsResolvedByCompanyAction = require("../actions/Incidents/countIncidentsResolvedByCompany");
const averageIncidentsResolutionTimeAction = require("../actions/Incidents/averageResolutionTimeByCompany");
const incidentEfficiencyByCompanyAction = require("../actions/Incidents/incidentEfficiencyByCompany");
const updateIncidentByScanAction = require("../actions/Incidents/updateIncidentByScan");
const getIncidentByIdAction = require("../actions/Incidents/getIncidentById");
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
        getIncidentsByCompany: getIncidentsByCompanyIdAction.getIncidentsByCompany,
        createIncident: createIncidentAction.createIncident,
        countIncidentsByCompany: countIncidentsByCompanyAction.countIncidentsByCompany,
        countIncidentsResolvedByCompany: countIncidentsResolvedByCompanyAction.countIncidentsResolvedByCompany,
        averageResolutionTimeByCompany: averageIncidentsResolutionTimeAction.averageResolutionTimeByCompany,
        incidentEfficiencyByCompany: incidentEfficiencyByCompanyAction.incidentEfficiencyByCompany,
        updateIncidentByScan: updateIncidentByScanAction.updateIncidentByScan,
        getIncidentById: getIncidentByIdAction.getIncidentById
    }
};