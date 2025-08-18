# Generador de Proformas - GD Panamá

Esta es una aplicación backend desarrollada en Node.js con TypeScript, diseñada para generar y gestionar documentos de proformas para la empresa GD Panamá.

## 📜 Descripción

El objetivo principal de este aplicativo es automatizar la creación de facturas proformas, utilizando plantillas predefinidas y datos dinámicos proporcionados a través de una API REST. La aplicación está contenerizada con Docker para facilitar su despliegue en cualquier entorno.

## ✨ Características Principales

* **API RESTful:** Endpoints para crear, leer, actualizar y eliminar proformas.
* **Generación de Documentos:** Creación de proformas en formato PDF (o el formato que uses) a partir de plantillas HTML.
* **Contenerización:** Lista para desplegarse en producción usando Docker.

---

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en un entorno de desarrollo local.

### **Prerrequisitos**

* **Node.js** (versión 22.x o superior)
* **Docker** y **Docker-Compose**

### **Instalación**

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <nombre-del-repo>
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto. Puedes usar el siguiente template:
    ```env
    # Configuración de la Base de Datos
    DB_SERVER=10.10.10.10
    DB_PORT=1433
    DB_USER=sa
    DB_PASSWORD=tu_contraseña_secreta

    # Puerto de la aplicación
    PORT=3000
    ```

### **Ejecución de la Aplicación**

* **Modo Desarrollo (con recarga automática):**
    ```bash
    npm run dev
    ```

* **Modo Producción (con Docker):**
    1.  Construye la imagen de Docker:
        ```bash
        docker build -t proformas-panama .
        ```
    2.  Ejecuta el contenedor:
        ```bash
        docker run -d -p 3000:3000 --name proformas-panama-app --env-file ./.env proformas-panama
        ```

---

## ⚙️ Variables de Entorno

A continuación se detallan las variables de entorno necesarias para el funcionamiento de la aplicación.

| Variable      | Descripción                                | Ejemplo                 |
| ------------- | ------------------------------------------ | ----------------------- |
| `DB_SERVER`   | Dirección IP o hostname del servidor de BD.| `10.10.10.10`           |
| `DB_PORT`     | Puerto de la base de datos.                | `1433`                  |
| `DB_USER`     | Usuario para la conexión a la BD.          | `sa`                    |
| `DB_PASSWORD` | Contraseña para la conexión a la BD.       | `9B83C5C174BEB678D27C7D`|
| `PORT`        | Puerto en el que correrá el servidor web.  | `3000`                  |