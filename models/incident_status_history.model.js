"use strict";
const Sequelize = require("sequelize");

module.exports = {
    name: "incident_status_history",
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
        previous_status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'statuses',
                key: 'id'
            }
        },
        new_status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'statuses',
                key: 'id'
            }
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_id: {
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
        timestamps: false,
        logging: false // Desactiva los logs
    },
    associations: function(models) {
        this.belongsTo(models.incidents, { foreignKey: 'incident_id', as: 'incident' });
        this.belongsTo(models.statuses, { foreignKey: 'previous_status_id', as: 'previous_status' });
        this.belongsTo(models.statuses, { foreignKey: 'new_status_id', as: 'new_status' });
        this.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.companies, { foreignKey: 'company_id', as: 'company' });
    }
};