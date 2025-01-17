"use strict";

const ApiGateway = require("moleculer-web");
const cors = require("cors");

module.exports = {
    name: "api",
    mixins: [ApiGateway],
    settings: {
        port: process.env.PORT || 3000,
        routes: [
            {
                path: "/api",
                use: [
                    cors({
                        origin: "http://localhost:3001", // Cambia esto al origen que necesites
                        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                        allowedHeaders: ["Content-Type", "Authorization"],
                        credentials: true
                    })
                ],
                aliases: {
                    "POST /users/login": "users.login",
                    "GET /users/usersGlobal": "users.getUsersGlobal",
                    "GET /users": "users.list",
					"GET /users/:id": "users.get",
                },
                mappingPolicy: "all", // Mapea todos los métodos de acción
            }
        ],
        assets: {
            folder: "public"
        }
    }
};