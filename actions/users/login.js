"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
    async login(ctx) {
        const user = await this.adapter.findOne({ where: { email: ctx.params.email } });
        if (!user) throw new Error("User not found");

        const match = await bcrypt.compare(ctx.params.password, user.password);
        if (!match) throw new Error("Invalid credentials");

        const [role, company] = await Promise.all([
            ctx.call("roles.get", { id: user.role_id }),
            ctx.call("companies.get", { id: user.company_id })
        ]);

        return { 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: {
                    id: user.role_id,
                    name: role.name
                },
                company: {
                    id: user.company_id,
                    name: company.name
                },
                creation_date: user.creation_date,
                phone_number: user.phone_number
            },
        };
    }
};