"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const getCategoriesByCompanyIdAction = require("../actions/companies/getCategories");
const categoriesModel = require("../models/categories.model");

module.exports = {
    name: "categories",
    mixins: [DbService],
    adapter: adapter,
    model: categoriesModel,
    settings: {
        fields: ["id", "name", "company_id"],
    },
    actions: {
        getCategoriesByCompany: getCategoriesByCompanyIdAction.getCategoriesByCompany
    }
};