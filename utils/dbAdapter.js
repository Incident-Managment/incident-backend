require('dotenv').config();
const SqlAdapter = require("moleculer-db-adapter-sequelize");

const {
    DB_CONNECTION,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD
} = process.env;

const adapter = new SqlAdapter(`${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);

module.exports = adapter;