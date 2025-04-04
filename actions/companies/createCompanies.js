"use strict"

module.exports = {
    async createCompanies(ctx) {
        const { name, address, phone, email } = ctx.params;

        const now = new Date();
        now.setHours(now.getHours() - 7);

        try {
            const newCompany = await this.adapter.insert({
                name,
                address,
                phone,
                email,
                creation_date: now,
            });

            return newCompany;
        } catch (error) {
            console.error("Error creating company:", error);
            throw new Error("Failed to create company");
        }
    }
};