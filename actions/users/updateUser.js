const bcrypt = require("bcrypt");

module.exports = {
    async updateUser(ctx) {
        try {
            const { id, name, email, password, phone_number } = ctx.params;

            if (!id) {
                throw new Error("ID de usuario no proporcionado");
            }

            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (phone_number) updateData.phone_number = phone_number;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await this.adapter.updateById(id, {
                $set: updateData
            });

            if (!updatedUser) {
                throw new Error("Usuario no encontrado o no se pudo actualizar");
            }

            return {
                success: true,
                message: "Usuario actualizado con éxito",
                user: updatedUser
            };

        } catch (error) {
            this.logger.error("Error actualizando usuario:", error);
            return {
                success: false,
                message: "Error actualizando usuario",
                error: error.message
            };
        }
    }
};