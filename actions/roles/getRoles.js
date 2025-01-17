"use strict";

module.exports = {
    getRolesGlobal: {
        rest: "GET /roles",
        async handler(ctx) {
            try {
                const user_roles = await this.adapter.find();
                return user_roles;
            } catch (error) {
                throw new Error("Failed to fetch users");
            }
        }
    }
};