"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const UserRolesModel = require("../models/user_roles.model");
const getRolesGlobalAction = require("../actions/roles/getRoles");

module.exports = {
    name: "roles",
    mixins: [DbService],
    adapter: adapter,
    model: UserRolesModel,
    settings: {
        fields: ["id", "name", "description"],
    },
    actions: {
        getRolesGlobal: getRolesGlobalAction.getRolesGlobal
    }
};