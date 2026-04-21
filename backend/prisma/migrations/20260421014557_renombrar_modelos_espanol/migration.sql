/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Contact";

-- CreateTable
CREATE TABLE "Contacto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "descripcion_servicio" TEXT,

    CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id")
);
