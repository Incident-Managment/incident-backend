"use strict";

const Sequelize = require("sequelize");

module.exports = {
    name: "users",
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
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'user_roles',
                key: 'id'
            }
        },
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'companies',
                key: 'id'
            }
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