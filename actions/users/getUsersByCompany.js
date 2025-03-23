"use strict";

module.exports = {
    async getUsersByCompany (ctx) {
        const companyId = ctx.params.companyId;
        if (!companyId) {
            throw new Error("companyId parameter is required");
        }

        try {
            console.log("Fetching users for companyId:", companyId);
            const users = await this.adapter.find({ query: { company_id: companyId } });

            const roleIds = [...new Set(users.map(user => user.role_id))];
            const companyIds = [companyId];

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
            console.error("Error fetching users by company:", error);
            throw new Error("Failed to fetch users by company");
        }
    }
}