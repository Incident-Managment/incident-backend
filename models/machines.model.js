"use strict";
const Sequelize = require("sequelize");

module.exports = {
    name: "machines",
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
        type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'machine_types',
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
        }
    },
    options: {
        timestamps: false,
        logging: false // Desactiva los logs
    },
    associations: function(models) {
        this.belongsTo(models.machine_types, { foreignKey: 'type_id', as: 'type' });
        this.belongsTo(models.companies, { foreignKey: 'company_id', as: 'company' });
    }
};