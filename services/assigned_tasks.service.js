"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const assigned_tasksModel = require("../models/assigned_tasks.model");
const CreateAssignedTaskAction = require("../actions/tasks/assigned_tasks");
const findTasksAction = require("../actions/tasks/find_tasks");
const findAssignedTasksByUserIdAction = require("../actions/tasks/assignedTasksByUserId");
const findAssignedTasksByIncidentIdAction = require("../actions/tasks/find_taskByIncidentId");
module.exports = {
    name: "assigned_tasks",
    mixins: [DbService],
    adapter: adapter,
    model: assigned_tasksModel,
    actions: {
        CreateAssignedTask: CreateAssignedTaskAction.CreateAssignedTask,
        findAssignedTasks: findTasksAction.findAssignedTasks,
        findAssignedTasksByUserId: findAssignedTasksByUserIdAction.findAssignedTasksByUserId,
        findAssignedTasksByIncidentId :findAssignedTasksByIncidentIdAction.findAssignedTasksByIncidentId
    }
};