-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('estudiante', 'admin');

-- CreateEnum
CREATE TYPE "Subtipo" AS ENUM ('partido', 'evento_publico');

-- CreateEnum
CREATE TYPE "AnuncioTipo" AS ENUM ('publico', 'seluvm');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'estudiante',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deporte" TEXT,
    "foto_url" TEXT,
    "estudiante_id" TEXT,
    "credential_expires_at" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_evento" TIMESTAMP(3) NOT NULL,
    "lugar" TEXT,
    "subtipo" "Subtipo" NOT NULL,
    "equipo_local" TEXT,
    "equipo_visita" TEXT,
    "resul_local" INTEGER,
    "resul_visita" INTEGER,
    "promoted_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anuncio" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" "AnuncioTipo" NOT NULL,
    "instagram_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anuncio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "descripcion_servicio" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_estudiante_id_key" ON "Usuario"("estudiante_id");

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anuncio" ADD CONSTRAINT "Anuncio_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
