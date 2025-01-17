"use strict";

module.exports = {
    getCompaniesGlobal: {
        rest: "GET /companiesGlobal",
        async handler(ctx) {
            try {
                const companies = await this.adapter.find();
                return companies;
            } catch (error) {
                throw new Error("Failed to fetch users");
            }
        }
    }
};