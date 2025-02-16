"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getIncidentStatusHistoryAction = require("../actions/Incidents/getIncidentStatusHistory");
const incidentStatusHistoryModel = require("../models/incident_status_history.model");

module.exports = {
    name: "incident_status_history",
    mixins: [DbService],
    adapter: adapter,
    model: incidentStatusHistoryModel,
    settings: {
        fields: ["id", "incident_id", "previous_status_id", "new_status_id", "comment", "user_id", "company_id", "createdAt","updatedAt"],
    },
    actions: {
        getIncidentStatusHistory: getIncidentStatusHistoryAction.getIncidentStatusHistory
    }
};