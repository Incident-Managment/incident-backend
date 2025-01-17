const SqlAdapter = require("moleculer-db-adapter-sequelize");

const adapter = new SqlAdapter("postgres://localhost:5432/IncidentDB");

module.exports = adapter;