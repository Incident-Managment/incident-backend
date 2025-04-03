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
const getRecentIncidentsByCompanyAction = require("../actions/Incidents/getRecentIncidents");
const incidentsModel = require("../models/incidents.model");
const getIncidentsByStatusMonthlyAction = require("../actions/Incidents/incidentByStatusesWeek&Mensual");
const getMostCommonProblemsByCategoryAction = require("../actions/Incidents/MostCommonProblemsByCategory");
const MonthlyEvolutionAction = require("../actions/Incidents/MensualEvolution");
const getCommonProblemsPercentageTodayAction = require("../actions/Incidents/commonProblemsToday");
const cancelIncidentAction = require("../actions/Incidents/cancellationIncidents");
const getIncidentsByDateRangeAction = require("../actions/Incidents/getIncidentsByDateRange");
const downloadReportAction = require("../actions/Incidents/downloadReport");
const createCommentsActions = require("../actions/Incidents/createCommentsIncidents");

module.exports = {
    name: "incidents",
    mixins: [DbService],
    adapter: adapter,
    model: incidentsModel,
    settings: {
        fields: ["id", "title", "description", "status_id", "priority_id", "category_id", "user_id", "machine_id", "company_id", "production_phase_id", "creation_date", "update_date", "comments", "commentstechnique"],
    },
    actions: {
        getIncidentsByCompany: getIncidentsByCompanyIdAction.getIncidentsByCompany,
        createIncident: createIncidentAction.createIncident,
        countIncidentsByCompany: countIncidentsByCompanyAction.countIncidentsByCompany,
        countIncidentsResolvedByCompany: countIncidentsResolvedByCompanyAction.countIncidentsResolvedByCompany,
        averageResolutionTimeByCompany: averageIncidentsResolutionTimeAction.averageResolutionTimeByCompany,
        incidentEfficiencyByCompany: incidentEfficiencyByCompanyAction.incidentEfficiencyByCompany,
        updateIncidentByScan: updateIncidentByScanAction.updateIncidentByScan,
        getIncidentById: getIncidentByIdAction.getIncidentById,
        getRecentIncidentsByCompany: getRecentIncidentsByCompanyAction.getRecentIncidentsByCompany,
        getIncidentsByStatusMonthly: getIncidentsByStatusMonthlyAction.getIncidentsByStatusMonthly,
        getMostCommonProblemsByCategory: getMostCommonProblemsByCategoryAction.getMostCommonProblemsByCategory,
        MonthlyEvolution: MonthlyEvolutionAction.MonthlyEvolution,
        getCommonProblemsPercentageToday: getCommonProblemsPercentageTodayAction.getCommonProblemsPercentageToday,
        cancelIncident: cancelIncidentAction.cancelIncident,
        getIncidentsByDateRange: getIncidentsByDateRangeAction.getIncidentsByDateRange,
        downloadReport: downloadReportAction.downloadReport,
        createComments: createCommentsActions.createComments,
    }
};