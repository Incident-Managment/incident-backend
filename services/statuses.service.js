"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getStatusesAction = require("../actions/companies/getStatuses");
const statusesModel = require("../models/statuses.model");

module.exports = {
    name: "statuses",
    mixins: [DbService],
    adapter: adapter,
    model: statusesModel,
    settings: {
        fields: ["id", "name"],
    },
    actions: {
        getStatuses: getStatusesAction.getStatuses
    }
};