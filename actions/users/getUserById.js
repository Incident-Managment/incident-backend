"use strict";

module.exports = {
    getUserById: {
        rest: "GET /users/:id",
        async handler(ctx) {
            try {
                const user = await this.adapter.findById(ctx.params.id);

                if (!user) {
                    throw new Error("User not found");
                }

                const [role, company] = await Promise.all([
                    ctx.call("roles.get", { id: user.role_id }),
                    ctx.call("companies.get", { id: user.company_id })
                ]);

                const userWithDetails = {
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
                };

                return userWithDetails;
            } catch (error) {
                throw new Error("Failed to fetch user");
            }
        }
    }
};