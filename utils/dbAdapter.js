require('dotenv').config();
const SqlAdapter = require("moleculer-db-adapter-sequelize");

const adapter = new SqlAdapter("postgres://postgres:conejomario1@localhost:5432/Notificaciones");

module.exports = adapter;
