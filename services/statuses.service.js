"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getStatusesByCompanyIdAction = require("../actions/companies/getStatuses");
const statusesModel = require("../models/statuses.model");

module.exports = {
    name: "statuses",
    mixins: [DbService],
    adapter: adapter,
    model: statusesModel,
    settings: {
        fields: ["id", "name", "company_id"],
    },
    actions: {
        getStatusesByCompany: getStatusesByCompanyIdAction.getStatusesByCompany
    }
};