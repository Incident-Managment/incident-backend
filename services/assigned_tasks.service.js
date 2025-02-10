"use strict";

const DbService = require("moleculer-db");
const adapter = require("../utils/dbAdapter");
const assigned_tasksModel = require("../models/assigned_tasks.model");
const CreateAssignedTaskAction = require("../actions/tasks/assigned_tasks");

module.exports = {
    name: "assigned_tasks",
    mixins: [DbService],
    adapter: adapter,
    model: assigned_tasksModel,
    settings: {
        fields: ["id", "incident_id", "assigned_user_id", "company_id", "assignment_date", "createdAt", "updatedAt"],
    },
    actions: {
        CreateAssignedTask: CreateAssignedTaskAction.CreateAssignedTask
    }
};