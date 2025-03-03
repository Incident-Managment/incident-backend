const { Service } = require("moleculer");
const firebaseAdmin = require("firebase-admin");

module.exports = {
  name: "storageService",

  async created() {
    // Inicializa Firebase con tu archivo de credenciales
    const serviceAccount = require("../firebase.json");

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      storageBucket: "movil-ios-android.appspot.com"
    });

    // Inicializa Firebase Storage
    this.storageBucket = firebaseAdmin.storage().bucket();
  },

  actions: {
    // Subir una imagen a Firebase Storage
    async uploadImage(ctx) {
      const file = ctx.params.file;  // El archivo debe ser un Buffer o Stream

      // Definir el nombre del archivo en el Storage (puedes personalizarlo)
      const fileName = `incidents/${ctx.params.filename}`;
      this.logger.info("Uploading file to Firebase Storage with filename:", fileName);

      try {
        // Subir el archivo a Firebase Storage
        await this.storageBucket.file(fileName).save(file, {
          contentType: 'image/jpeg', // Cambiar según el tipo de imagen
          public: true
        });

        // Obtener la URL pública del archivo
        const publicUrl = this.storageBucket.file(fileName).publicUrl();
        this.logger.info("File uploaded successfully. Public URL:", publicUrl);
        return { success: true, url: publicUrl };
      } catch (err) {
        this.logger.error("Error uploading file to Firebase Storage:", err);
        throw new Error("Error uploading file to Firebase Storage");
      }
    },

    // Obtener una imagen desde Firebase Storage
    async getImage(ctx) {
      const fileName = `${ctx.params.filename}`;
      const file = this.storageBucket.file(fileName);

      // Verificar si el archivo existe
      const exists = await file.exists();
      if (!exists[0]) {
        throw new Error("El archivo no existe.");
      }

      // Obtener la URL pública
      const publicUrl = file.publicUrl();
      return { success: true, url: publicUrl };
    }
  }
};