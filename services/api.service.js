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
                        origin: "*",
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
                    "GET /users/techniqueUsersByRoleAndCompany": "users.getTechniqueUsersByRoleAndCompany",
                    "PUT /users/updateUser": "users.updateUser",
                    /* COMPANIES */
                    "GET /companies/getCompaniesGlobal": "companies.getCompaniesGlobal",
                    "GET /prioritiesByCompany": "priorities.getPrioritiesByCompany",
                    "GET /statuses/getStatuses": "statuses.getStatuses",
                    "GET /categoriesByCompany": "categories.getCategoriesByCompany",
                    "GET /productionPhasesByCompany": "production_phases.getProductionPhasesByCompany",
                    "PUT /production_phases/updateProductionPhase": "production_phases.updateProductionPhase",
                    "POST /production_phases/createProductionPhase": "production_phases.createProductionPhase",
                    /* ROLES */
                    "GET /roles/getRolesGlobal": "roles.getRolesGlobal",

                    /* MACHINES */
                    "GET /machine_types/getMachineTypesGlobal": "machine_types.getMachineTypesGlobal",
                    "GET /machines/getMachinesGlobal": "machines.getMachinesGlobal",
                    "GET /machines/getMachinesByCompany": "machines.getMachinesByCompany",
                    "GET /phases_machine/getMachinesByPhase": "phases_machine.getMachinesByPhase",
                    "POST /machines/createMachines": "machines.createMachines",
                    "POST /phases_machine/addMachinesToPhase": "phases_machine.addMachinesToPhase",

                    /* INCIDENTS */
                    "GET /incidents/incidentsByCompany": "incidents.getIncidentsByCompany",
                    "GET /incidents/incidentStatusHistoryByIncident": "incident_status_history.getIncidentStatusHistory",
                    "POST /incidents/create": "incidents.createIncident",
                    "GET /incidents/countIncidentsByCompany": "incidents.countIncidentsByCompany",
                    "GET /incidents/countIncidentsResolvedByCompany": "incidents.countIncidentsResolvedByCompany",
                    "GET /incidents/averageResolutionTimeByCompany": "incidents.averageResolutionTimeByCompany",
                    "GET /incidents/incidentEfficiencyByCompany": "incidents.incidentEfficiencyByCompany",
                    "PUT /incidents/updateIncidentByScan": "incidents.updateIncidentByScan",
                    "GET /incidents/getIncidentById": "incidents.getIncidentById",
                    "GET /incidents/getRecentIncidentsByCompany": "incidents.getRecentIncidentsByCompany",
                    "POST /incident_status_history/create": "incident_status_history.createIncidentHistory",
                    "GET /incidents/incidentsByStatusMonthly": "incidents.getIncidentsByStatusMonthly",
                    "GET /incidents/mostCommonProblemsByCategory": "incidents.getMostCommonProblemsByCategory",
                    "GET /incidents/monthlyEvolution": "incidents.MonthlyEvolution",
                    "GET /incidents/mostCommonProblemsByCategory": "incidents.getMostCommonProblemsByCategory",
                    /* TASKS */
                    "POST /tasks/create": "assigned_tasks.CreateAssignedTask",
                    "GET /assigned_tasks/findAssignedTasks": "assigned_tasks.findAssignedTasks",
                    "GET /assigned_tasks/findAssignedTasksByUserId": "assigned_tasks.findAssignedTasksByUserId",
                    "GET /assigned_tasks/findAssignedTasksByIncidentId": "assigned_tasks.findAssignedTasksByIncidentId",
                    "GET /assigned_tasks/featureTechnicians": "assigned_tasks.featureTechnicians",
                    /* EXTERNAL */
                    "POST /slack/sendMessage": "slack.sendMessage",

                    /* STORAGE */
                    "POST /storage/uploadImage": "storageService.uploadImage",
                    "GET /storage/getImage/:filename": "storageService.getImage",
                },
                mappingPolicy: "all",
            }
        ],
        assets: {
            folder: "public"
        }
    }
};