"use strict";
const Sequelize = require("sequelize");

module.exports = {
    name: "phases_machine",
    define: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        production_phase_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'production_phases',
                key: 'id'
            }
        },
        machine_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'machines',
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
        }
    },
    options: {
        timestamps: true,
    },
    associations: function(models) {
        this.belongsTo(models.production_phases, { foreignKey: 'production_phase_id', as: 'production_phase' });
        this.belongsTo(models.machines, { foreignKey: 'machine_id', as: 'machine' });
    }
};