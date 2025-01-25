const SqlAdapter = require("moleculer-db-adapter-sequelize");

const adapter = new SqlAdapter("postgres://postgres:2020@localhost:5432/IncidentDB");

module.exports = adapter;