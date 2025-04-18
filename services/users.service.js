"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const UsersModel = require("../models/users.model");
const loginAction = require("../actions/users/login");
const createUserAction = require("../actions/users/createUser");
const getUsersGlobalAction = require("../actions/users/getUsers");
const getUserByIdAction = require("../actions/users/getUserById");
const getTechniqueUsersByRoleAndCompanyAction = require("../actions/users/getTechinqueUsers");
const updateUserAction = require("../actions/users/updateUser"); //Importa la acción de editar
const getUsersByCompanyAction = require("../actions/users/getUsersByCompany");
module.exports = {
    name: "users",
    mixins: [DbService],
    adapter: adapter,
    model: UsersModel,
    settings: {
        fields: ["id", "name", "email", "password", "role_id", "company_id", "creation_date","phone_number"],
        JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret"
    },
    actions: {
        createUser: createUserAction.createUser,
        login: loginAction.login,
        getUsersGlobal: getUsersGlobalAction.getUsersGlobal,
        getUserById: getUserByIdAction.getUserById,
        getTechniqueUsersByRoleAndCompany: getTechniqueUsersByRoleAndCompanyAction.getTechniqueUsersByRoleAndCompany,
        updateUser: updateUserAction.updateUser,
        getUsersByCompany: getUsersByCompanyAction.getUsersByCompany
    }
};