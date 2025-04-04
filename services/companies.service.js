"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const CompaniesModel = require("../models/companies.model");
const getCompaniesGlobalAction = require("../actions/companies/getCompanies");
const createCompaniesAction = require("../actions/companies/createCompanies");
const editCompanyAction = require("../actions/companies/editCompany");

module.exports = {
    name: "companies",
    mixins: [DbService],
    adapter: adapter,
    model: CompaniesModel,
    settings: {
        fields: ["id", "name", "address", "phone", "email", "creation_date"],
    },
    actions: {
        getCompaniesGlobal: getCompaniesGlobalAction.getCompaniesGlobal,
        createCompanies: createCompaniesAction.createCompanies,
        editCompany: editCompanyAction.editCompany
    }
};