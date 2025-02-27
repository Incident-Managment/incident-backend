const { Service } = require("moleculer");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();
module.exports = {
	name: "cloudinary",

	/**
	 * Métodos y eventos del servicio
	 */
	actions: {
		/**
		 * Sube una imagen a Cloudinary
		 *
		 * @param {String} imagePath - Ruta local de la imagen
		 * @param {String} folder - Carpeta opcional donde almacenar la imagen
		 */
		upload: {
			params: {
				imagePath: "string",
				folder: { type: "string", optional: true },
			},
			async handler(ctx) {
				const { imagePath, folder } = ctx.params;

				try {
					const result = await cloudinary.uploader.upload(imagePath, {
						folder: folder || "default",
					});
					return {
						url: result.secure_url,
						public_id: result.public_id,
					};
				} catch (err) {
					this.logger.error("Error al subir la imagen:", err);
					throw new Error("Error al subir la imagen a Cloudinary");
				}
			},
		},

		/**
		 * Elimina una imagen de Cloudinary
		 *
		 * @param {String} publicId - ID público de la imagen
		 */
		delete: {
			params: {
				publicId: "string",
			},
			async handler(ctx) {
				const { publicId } = ctx.params;

				try {
					const result = await cloudinary.uploader.destroy(publicId);
					return {
						message: "Imagen eliminada con éxito",
						result,
					};
				} catch (err) {
					this.logger.error("Error al eliminar la imagen:", err);
					throw new Error("Error al eliminar la imagen en Cloudinary");
				}
			},
		},
	},

	/**
	 * Configura Cloudinary al iniciar el servicio
	 */
	created() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
		this.logger.info("Cloudinary configurado correctamente.");
	},
};
