"use strict";

module.exports = {
    async getMachineTypesGlobal (ctx)  {
            try {
                const machine_types = await this.adapter.find();
                return machine_types;
            } catch (error) {
                throw new Error("Failed to fetch users");
            }
        }
    };