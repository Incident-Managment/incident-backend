"use strict";

module.exports = {
    async getRolesGlobal (ctx) {
        try {
            const user_roles = await this.adapter.find();
            return user_roles;
        } catch (error) {
            console.error("Error fetching user roles:", error);
            throw new Error("Failed to fetch user roles");
        }
    }
};