"use strict";
const Sequelize = require("sequelize");

module.exports = {
    name: "production_phases",
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
        phase_order: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'companies',
                key: 'id'
            }
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        creation_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    options: {
        indexes: [
            {
                unique: true,
                fields: ['company_id', 'phase_order']
            }
        ],
        timestamps: false
    },
    associations: function(models) {
        this.belongsTo(models.companies, { foreignKey: 'company_id', as: 'company' });
    }
};