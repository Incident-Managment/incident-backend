# 1. Usar una imagen base con Node y pnpm
FROM node:18-alpine

# 2. Instalar pnpm globalmente
RUN npm install -g pnpm

# 3. Establecer el directorio de trabajo
WORKDIR /app

# 4. Copiar solo los archivos de configuración (optimiza el caché)
COPY package.json pnpm-lock.yaml ./

# 5. Instalar las dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# 6. Copiar el código fuente
COPY . .

# 7. Exponer el puerto (ajústalo al de tu servicio)
EXPOSE 3000

# 8. Comando para ejecutar Moleculer
CMD ["pnpm", "moleculer-runner", "--repl"]
