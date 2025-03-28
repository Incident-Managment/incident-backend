"use strict";

const bcrypt = require("bcrypt");
const { formattedDate } = require("../../utils/dateUtils");

module.exports = {
    async createUser(ctx) {
        const hashedPassword = await bcrypt.hash(ctx.params.password, 10);
        const creation_date = formattedDate();
        const newUser = await this.adapter.insert({
            name: ctx.params.name,
            email: ctx.params.email,
            password: hashedPassword,
            role_id: parseInt(ctx.params.role_id, 10),
            company_id: parseInt(ctx.params.company_id, 10),
            creation_date: creation_date,
            phone_number: ctx.params.phone_number,
        });
        const message = 'Bienvenido a la plataforma';
        const phone_number = ctx.params.phone_number;
        await ctx.broker.emit('send.sms', { to: phone_number, body: message });

        return newUser;
    }
};