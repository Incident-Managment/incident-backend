"use strict"

module.exports = {
    async editCompany(ctx) {
        const { id, name, address, phone, email } = ctx.params;

        try {
            const existingCompany = await this.adapter.findById(id);
            if (!existingCompany) {
                throw new Error("Company not found");
            }

            const updatedCompany = await this.adapter.updateById(id, {
                $set: {
                    ...(name && { name }),
                    ...(address && { address }),
                    ...(phone && { phone }),
                    ...(email && { email }),
                }
            });

            return updatedCompany;
        } catch (error) {
            console.error("Error editing company:", error);
            throw new Error("Failed to edit company");
        }
    }
};