"use strict";

module.exports = {
    async getCompaniesGlobal (ctx) {
            try {
                const companies = await this.adapter.find();
                return companies;
            } catch (error) {
                throw new Error("Failed to fetch users");
            }
        }
    };