"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
    async login(ctx) {
        const user = await this.adapter.findOne({ where: { email: ctx.params.email } });
        if (!user) throw new Error("User not found");

        const match = await bcrypt.compare(ctx.params.password, user.password);
        if (!match) throw new Error("Invalid credentials");

        const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id, company_id: user.company_id }, "secret", { expiresIn: "1h" });
        return { 
            token,
            user: {
                id: user.id,
                email: user.email,
                role_id: user.role_id,
                company_id: user.company_id,
                name: user.name
            }
        };
    }
};