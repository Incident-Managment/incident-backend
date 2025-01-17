"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const UserRolesModel = require("../models/user_roles.model");
const getRolesGlobalAction = require("../actions/roles/getRoles");

module.exports = {
    name: "roles",
    mixins: [DbService],
    adapter: new SqlAdapter("postgres://localhost:5432/IncidentDB"),
    model: UserRolesModel,
    settings: {
        fields: ["id", "name", "description"],
    },
    actions: {
        getRolesGlobal: getRolesGlobalAction.getRolesGlobal
    }
};
