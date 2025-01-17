"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const CompaniesModel = require("../models/companies.model");
const getCompaniesGlobalAction = require("../actions/companies/getCompanies");

module.exports = {
    name: "companies",
    mixins: [DbService],
    adapter: adapter,
    model: CompaniesModel,
    settings: {
        fields: ["id", "name", "address", "phone", "email", "creation_date"],
    },
    actions: {
        getCompaniesGlobal: getCompaniesGlobalAction.getCompaniesGlobal
    }
};