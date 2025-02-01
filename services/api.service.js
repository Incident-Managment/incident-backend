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
                        origin: true,
                        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                        allowedHeaders: ["Content-Type", "Authorization"],
                        credentials: true
                    })
                ],
                aliases: {
                    /* USERS */
                    "POST /users/login": "users.login",
                    "POST /users/create": "users.createUser",
                    "GET /users/usersGlobal": "users.getUsersGlobal",
                    "GET /users/getUserById/:id": "users.getUserById",
                    "GET /users": "users.list",
                    "GET /users/:id": "users.get",

                    /* COMPANIES */
                    "GET /companies/getCompaniesGlobal": "companies.getCompaniesGlobal",
                    "GET /prioritiesByCompany": "priorities.getPrioritiesByCompany",
                    "GET /statusesByCompany": "statuses.getStatusesByCompany",
                    "GET /categoriesByCompany": "categories.getCategoriesByCompany",
                    "GET /productionPhasesByCompany": "production_phases.getProductionPhasesByCompany",
                    /* ROLES */
                    "GET /roles/getRolesGlobal": "roles.getRolesGlobal",

                    /* MACHINES */
                    "GET /machine_types/getMachineTypesGlobal": "machine_types.getMachineTypesGlobal",
                    "GET /machines/getMachinesGlobal": "machines.getMachinesGlobal",
                    "GET /machines/getMachinesByCompany": "machines.getMachinesByCompany",

                    /* INCIDENTS */
                    "GET /incidentsByCompany": "incidents.getIncidentsByCompany",
                    "GET /incidentStatusHistoryByIncident": "incident_status_history.getIncidentStatusHistory",
                    "POST /incidents/create": "incidents.createIncident",


                    /*EXTERNAL*/
                    "POST /slack/sendMessage": "slack.sendMessage",
                },
                mappingPolicy: "all",
            }
        ],
        assets: {
            folder: "public"
        }
    }
};