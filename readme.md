# API Rest Dementes 🧠

API REST para la gestión de citas de salud mental construida con Node.js, Express y PostgreSQL.

## 🚀 Requisitos Previos

- Node.js v20 o superior y PostgreSQL v17 (instalación tradicional)

- Docker y Docker Compose (instalacion con Docker)

## 🛠️ Opción 1: Instalación Tradicional

1. **Clonar y preparar dependencias**

```bash
   git clone https://github.com/RichardTorresRivera/api-rest-dementes.git
   cd api-rest-dementes
   npm install
```

2. **Configurar variables de entorno**

   Crea un archivo .env en la raíz del proyecto basándote en el archivo de ejemplo:

```bash
cp .env.example .env
Edita el .env con tus credenciales de base de datos local:
```

3. **Inicializar Base de Datos y Seed**

Este comando ejecutará el esquema y cargará los datos de prueba (usuarios con contraseñas encriptadas):

```bash
npm run db:setup
```

4. **Iniciar el servidor**

```bash
npm run dev
```

## 🐳 Opción 2: Instalación con Docker

Esta opción levanta automáticamente la base de datos PostgreSQL 17 y la API en contenedores aislados.

1. **Levantar contenedores**

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

2. **Ejecutar Seed de datos**

Una vez que los contenedores estén corriendo, ejecuta el siguiente comando para poblar la base de datos (asegúrate de que el nombre del contenedor de la api sea el correcto):

```bash
docker exec -it dementes_api_rest_dev-api-rest-1 npm run db:setup
```

3. **Ver logs**

```Bash
docker logs -f dementes_api_rest_dev-api-rest-1
```

## 📂 Estructura del Proyecto

- /server/modules: Lógica dividida por dominios (Auth, Paciente, Psicólogo, Citas, etc.).

- /server/middlewares: Manejo de errores, autenticación y validaciones.

- /db: Scripts de inicialización SQL (schema.sql) y semillas de datos (seed.js).

- /server/config: Configuración de entorno y conexión a Postgres.

🔑 Cuentas de Prueba (Seed)

| Rol       | Email             | Password |
| --------- | ----------------- | -------- |
| Admin     | admin@test.com    | test     |
| Paciente  | paciente@test.com | test     |
| Psicólogo | psico@test.com    | test     |
