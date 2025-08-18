# Stage 1: Build the application
# Usa una imagen base de Node.js, preferiblemente una versión LTS y ligera como alpine
FROM node:22-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto (package.json y package-lock.json)
# Esto permite que Docker use el caché de capas de forma eficiente
COPY package*.json ./

# Instala todas las dependencias (tanto de producción como de desarrollo)
# 'npm ci' es preferible para builds reproducibles
RUN npm ci

# Copia el resto de los archivos de la aplicación, incluyendo 'src'
# En este punto, 'src/public', 'src/generated_files', 'src/templates' estarán en /app/src/...
COPY . .

# Compila la aplicación TypeScript a JavaScript
# Esto creará la carpeta 'dist' en /app/dist
RUN npm run build

# Stage 2: Create the final production image
# Usa una imagen base más pequeña para la imagen final de producción
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos de configuración de dependencias de producción
# desde el stage 'builder'
COPY --from=builder /app/package*.json ./

# Instala solo las dependencias de producción
RUN npm ci --omit=dev

# Copia los archivos JavaScript compilados desde la carpeta 'dist' del stage 'builder'
COPY --from=builder /app/dist ./dist

# AHORA, COPIA CADA CARPETA DE RECURSOS ESTÁTICOS DESDE EL STAGE 'builder' AL DIRECTORIO 'dist'
# La ruta de origen es /app/src/<nombre_carpeta>
# La ruta de destino es /app/dist/<nombre_carpeta>
COPY --from=builder /app/src/public ./dist/public
COPY --from=builder /app/src/generated_files ./dist/generated_files
COPY --from=builder /app/src/templates ./dist/templates

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Define el comando para ejecutar la aplicación cuando el contenedor inicie
CMD ["npm", "start"]
