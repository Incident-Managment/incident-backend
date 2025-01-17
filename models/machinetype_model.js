"use strict";

const Sequelize = require("sequelize");

module.exports = {
    name: "machine_types",
    define: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
    options: {
        timestamps: false
    }
};