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
                    "GET /statuses/getStatuses": "statuses.getStatuses",
                    "GET /categoriesByCompany": "categories.getCategoriesByCompany",
                    "GET /productionPhasesByCompany": "production_phases.getProductionPhasesByCompany",
                    "POST /updateProductionPhase": "production_phases.updateProductionPhase",
                    /* ROLES */
                    "GET /roles/getRolesGlobal": "roles.getRolesGlobal",

                    /* MACHINES */
                    "GET /machine_types/getMachineTypesGlobal": "machine_types.getMachineTypesGlobal",
                    "GET /machines/getMachinesGlobal": "machines.getMachinesGlobal",
                    "GET /machines/getMachinesByCompany": "machines.getMachinesByCompany",

                    /* INCIDENTS */
                    "GET /incidents/incidentsByCompany": "incidents.getIncidentsByCompany",
                    "GET /incidents/incidentStatusHistoryByIncident": "incident_status_history.getIncidentStatusHistory",
                    "POST /incidents/create": "incidents.createIncident",
                    "GET /incidents/countIncidentsByCompany": "incidents.countIncidentsByCompany",
                    "GET /incidents/countIncidentsResolvedByCompany": "incidents.countIncidentsResolvedByCompany",
                    "GET /incidents/averageResolutionTimeByCompany": "incidents.averageResolutionTimeByCompany",
                    "GET /incidents/incidentEfficiencyByCompany": "incidents.incidentEfficiencyByCompany",

                    /* TASKS */
                    "POST /tasks/create": "assigned_tasks.CreateAssignedTask",

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