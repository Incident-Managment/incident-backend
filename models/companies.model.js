"use strict";

const Sequelize = require("sequelize");

module.exports = {
    name: "companies",
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
        address: {
            type: Sequelize.TEXT
        },
        phone: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        creation_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    options: {
        timestamps: false
    }
};