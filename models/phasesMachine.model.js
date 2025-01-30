"use strict";
const Sequelize = require("sequelize");

module.exports =  {
    name: "phases_machines",
    phase_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    machine_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Composite primary key
    },
    company_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Composite primary key
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
}
