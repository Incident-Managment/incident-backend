"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const UsersModel = require("../models/users.model");
const loginAction = require("../actions/users/login");
const createUserAction = require("../actions/users/createUser");
const getUsersGlobalAction = require("../actions/users/getUsers");

module.exports = {
    name: "users",
    mixins: [DbService],
    adapter: new SqlAdapter("postgres://localhost:5432/IncidentDB"),
    model: UsersModel,
    settings: {
        fields: ["id", "name", "email", "password", "role_id", "company_id", "creation_date"],
        JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret"
    },
    actions: {
        createUser: createUserAction.createUser,
        login: loginAction.login,
        getUsersGlobal: getUsersGlobalAction.getUsersGlobal
    }
};