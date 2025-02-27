"use strict";

module.exports = {
    async getUsersGlobal (ctx) {
            try {
                const users = await this.adapter.find();

                const roleIds = [...new Set(users.map(user => user.role_id))];
                const companyIds = [...new Set(users.map(user => user.company_id))];

                const [roles, companies] = await Promise.all([
                    ctx.call("roles.find", { id: roleIds }),
                    ctx.call("companies.find", { id: companyIds })
                ]);

                const roleMap = roles.reduce((acc, role) => {
                    acc[role.id] = role.name;
                    return acc;
                }, {});

                const companyMap = companies.reduce((acc, company) => {
                    acc[company.id] = company.name;
                    return acc;
                }, {});

                const usersWithDetails = users.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: {
                        id: user.role_id,
                        name: roleMap[user.role_id]
                    },
                    company: {
                        id: user.company_id,
                        name: companyMap[user.company_id]
                    },
                    creation_date: user.creation_date,
                    phone_number: user.phone_number
                }));

                usersWithDetails.sort((a, b) => a.id - b.id);

                return usersWithDetails;
            } catch (error) {
                throw new Error("Failed to fetch users");
            }
        }
    };