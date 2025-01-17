"use strict";

const ApiGateway = require("moleculer-web");
const cors = require("cors");

module.exports = {
    name: "api",
    mixins: [ApiGateway],
    settings: {
        port: process.env.PORT || 3000,
        routes: [
            {
                path: "/api",
                use: [
                    cors({
                        origin: "http://localhost:3001",
                        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                        allowedHeaders: ["Content-Type", "Authorization"],
                        credentials: true
                    })
                ],
                aliases: {
                    /*USERS */
                    "POST /users/login": "users.login",
                    'POST /users/create': 'users.createUser',
                    "GET /users/usersGlobal": "users.getUsersGlobal",
                    "GET /users/getUserById/:id": "users.getUserById",
                    "GET /users": "users.list",
					"GET /users/:id": "users.get",


                    /*COMPANIES */
                    "GET /companies/getCompaniesGlobal": "companies.getCompaniesGlobal",


                    /*ROLES */
                    "GET /roles/getRolesGlobal": "roles.getRolesGlobal",

                    /*MACHINES */
                    "GET /machine_types/getMachineTypesGlobal": "machine_types.getMachineTypesGlobal",
                    "GET /machines/getMachinesGlobal": "machines.getMachinesGlobal",
                },
                mappingPolicy: "all", // Mapea todos los métodos de acción
            }
        ],
        assets: {
            folder: "public"
        }
    }
};