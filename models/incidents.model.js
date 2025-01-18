"use strict";
const Sequelize = require("sequelize");

module.exports = {
    name: "incidents",
    define: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'statuses',
                key: 'id'
            }
        },
        priority_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'priorities',
                key: 'id'
            }
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        machine_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'machines',
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
        production_phase_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'production_phases',
                key: 'id'
            }
        },
        creation_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        update_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    options: {
        timestamps: false
    },
    associations: function(models) {
        this.belongsTo(models.statuses, { foreignKey: 'status_id', as: 'status' });
        this.belongsTo(models.priorities, { foreignKey: 'priority_id', as: 'priority' });
        this.belongsTo(models.categories, { foreignKey: 'category_id', as: 'category' });
        this.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.machines, { foreignKey: 'machine_id', as: 'machine' });
        this.belongsTo(models.companies, { foreignKey: 'company_id', as: 'company' });
        this.belongsTo(models.production_phases, { foreignKey: 'production_phase_id', as: 'production_phase' });
    }
};