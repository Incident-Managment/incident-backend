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
                    "GET /users/techniqueUsersByRoleAndCompany": "users.getTechniqueUsersByRoleAndCompany",

                    /* COMPANIES */
                    "GET /companies/getCompaniesGlobal": "companies.getCompaniesGlobal",
                    "GET /prioritiesByCompany": "priorities.getPrioritiesByCompany",
                    "GET /statuses/getStatuses": "statuses.getStatuses",
                    "GET /productionPhasesByCompany/:companyId": "production_phases.getProductionPhasesByCompany",
                    "POST /createProductionPhases": "production_phases.postProductionPhase",
                    "PUT /updateProductionPhase/:id": "production_phases.updateProductionPhase",

                    /* ROLES */
                    "GET /roles/getRolesGlobal": "roles.getRolesGlobal",

                    /* MACHINES */
                    "GET /machine_types/getMachineTypesGlobal": "machine_types.getMachineTypesGlobal",
                    "GET /machines/getMachinesGlobal": "machines.getMachinesGlobal",
                    "GET /machines/getMachinesByCompany": "machines.getMachinesByCompany",
                    "GET /phases_machine/getMachinesByPhase": "phases_machine.getMachinesByPhase",
                    "POST /machines/createMachines": "machines.createMachine",
                    "POST /phases_machine/addMachinesToPhase": "phases_machine.addMachinesToPhase",
                    "PUT /machines/updateMachine/:id": "machines.updateMachine",

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
                    "POST /createProductionPhases": "production_phases.postProductionPhase",
            
                    /* TASKS */
                    "POST /tasks/create": "assigned_tasks.CreateAssignedTask",
                    "GET /assigned_tasks/findAssignedTasks": "assigned_tasks.findAssignedTasks",
                    "GET /assigned_tasks/findAssignedTasksByUserId": "assigned_tasks.findAssignedTasksByUserId",
                    "GET /assigned_tasks/findAssignedTasksByIncidentId": "assigned_tasks.findAssignedTasksByIncidentId",
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