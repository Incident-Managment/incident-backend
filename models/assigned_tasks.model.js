"use strict"
const Sequelize = require("sequelize");

module.exports = {
    name: "assigned_tasks",
    define: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        incident_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'incidents',
                key: 'id'
            }
        },
        assigned_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
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
        assignment_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    },
    options: {
        timestamps: true,
        logging: false // Desactiva los logs
    },
}