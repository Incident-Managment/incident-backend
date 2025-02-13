// index.js
"use strict";
const { ServiceBroker } = require("moleculer");

// Crear el broker
const broker = new ServiceBroker({
    nodeID: "incident-backend",
    transporter: "NATS",
});

// Cargar servicios manualmente
broker.loadServices("./services");

// Iniciar el broker
broker.start().then(() => {
    broker.repl(); // Para usar comandos interactivos
});