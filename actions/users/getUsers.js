"use strict";

module.exports = {
    getUsersGlobal: {
        rest: "GET /usersGlobal",
        async handler(ctx) {
            try {
                const users = await this.adapter.find();
                return users;
            } catch (error) {
                throw new Error("Failed to fetch users");
            }
        }
    }
};