"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const CompaniesModel = require("../models/companies.model")
const getCompaniesGlobalAction = require("../actions/companies/getCompanies");

module.exports = {
    name: "companies",
    mixins: [DbService],
    adapter: new SqlAdapter("postgres://localhost:5432/IncidentDB"),
    model: CompaniesModel,
    settings: {
        fields: ["id", "name", "address", "phone", "email", "creation_date"],
    },
    actions: {
        getCompaniesGlobal: getCompaniesGlobalAction.getCompaniesGlobal
    }
};
