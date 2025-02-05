require('dotenv').config();
const SqlAdapter = require("moleculer-db-adapter-sequelize");

const adapter = new SqlAdapter("postgres://adminsp:4SxYdhnha3g6uhgndTvD@178.16.142.77:5432/incidentdb");

module.exports = adapter;
