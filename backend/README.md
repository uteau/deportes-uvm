# Deportes UVM — Backend

API REST construida con **NestJS** y **TypeScript**, usando **Prisma ORM** con **PostgreSQL** como base de datos.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- PostgreSQL 14 o superior (local o en Railway)

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/deportes_uvm` |
| `JWT_SECRET` | Clave secreta para firmar los JWT | `mi-clave-super-secreta` |
| `JWT_EXPIRES_STUDENT` | Duración del token de estudiante | `8h` |
| `JWT_EXPIRES_ADMIN` | Duración del token de administrador | `4h` |
| `PORT` | Puerto en que escucha el servidor | `3000` |

## Base de datos

```bash
# Generar el cliente Prisma
npm run prisma:generate

# Crear y aplicar migraciones (desarrollo)
npm run prisma:migrate

# Aplicar migraciones en producción
npm run prisma:migrate:prod

# Abrir Prisma Studio (explorador visual de la BD)
npm run prisma:studio

# Ejecutar seed (crear cuentas de administrador)
npm run seed
```

## Desarrollo

```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Endpoints principales

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Health check | Pública |
| `POST` | `/api/auth/login` | Login (estudiante o admin) | Pública |
| `POST` | `/api/auth/logout` | Logout | Pública |
| `GET` | `/api/feed` | Feed combinado (eventos + anuncios públicos) | Pública |
| `GET` | `/api/events` | Listar eventos | Pública |
| `GET` | `/api/events/:id` | Detalle de evento | Pública |
| `GET` | `/api/announcements/public` | Listar anuncios públicos | Pública |
| `GET` | `/api/estudiante/credencial` | Credencial digital | JWT estudiante |
| `GET` | `/api/announcements/selected` | Anuncios para seleccionados | JWT estudiante |
| `GET` | `/api/contacts` | Contactos del área de deportes | JWT estudiante |
| `POST` | `/api/admin/events` | Crear evento | JWT admin |
| `PUT` | `/api/admin/events/:id` | Editar evento | JWT admin |
| `DELETE` | `/api/admin/events/:id` | Eliminar evento | JWT admin |
| `POST` | `/api/admin/announcements/public` | Crear anuncio público | JWT admin |
| `POST` | `/api/admin/announcements/selected` | Crear anuncio seleccionado | JWT admin |
| `GET` | `/api/admin/usuarios` | Listar estudiantes | JWT admin |
| `POST` | `/api/admin/usuarios` | Crear estudiante | JWT admin |
| `PATCH` | `/api/admin/usuarios/:id/status` | Activar/desactivar cuenta | JWT admin |
| `POST` | `/api/admin/usuarios/import-csv` | Importar estudiantes desde CSV | JWT admin |

## Estructura del proyecto

```
backend/
├── prisma/
│   └── schema.prisma       # Esquema de la base de datos
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## Despliegue en Railway

1. Crear un proyecto en [Railway](https://railway.app)
2. Agregar un servicio PostgreSQL
3. Conectar el repositorio de GitHub
4. Configurar las variables de entorno en Railway
5. El despliegue se ejecuta automáticamente con cada push a `main`
