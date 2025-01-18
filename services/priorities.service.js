"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getPrioritiesByCompanyIdAction = require("../actions/companies/getPriorities");
const prioritiesModel = require("../models/priorities.model");

module.exports = {
    name: "priorities",
    mixins: [DbService],
    adapter: adapter,
    model: prioritiesModel,
    settings: {
        fields: ["id", "name", "company_id"],
    },
    actions: {
        getPrioritiesByCompany: getPrioritiesByCompanyIdAction.getPrioritiesByCompany
    }
};