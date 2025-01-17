"use strict";

const Sequelize = require("sequelize");

module.exports = {
    name: "user_roles",
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
        description: {
            type: Sequelize.TEXT
        }
    },
    options: {
        timestamps: false
    }
};