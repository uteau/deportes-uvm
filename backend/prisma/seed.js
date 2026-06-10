// prisma/seed.js
// Script de seed para crear cuentas de administrador en la base de datos.
// Uso: node prisma/seed.js  (o npm run seed)
// Las credenciales se leen desde variables de entorno.

'use strict';

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

/**
 * Lee y valida las variables de entorno para un administrador.
 * @param {string} emailVar   - Nombre de la variable de entorno para el email.
 * @param {string} passwordVar - Nombre de la variable de entorno para la contraseña.
 * @param {string} nombreVar  - Nombre de la variable de entorno para el nombre.
 * @param {string} defaultEmail  - Valor por defecto para el email.
 * @param {string} defaultNombre - Valor por defecto para el nombre.
 * @returns {{ email: string, password: string, nombre: string } | null}
 */
function readAdminEnv(emailVar, passwordVar, nombreVar, defaultEmail, defaultNombre) {
  const email = process.env[emailVar] || defaultEmail;
  const password = process.env[passwordVar];
  const nombre = process.env[nombreVar] || defaultNombre;

  if (!password) {
    return null;
  }

  return { email, password, nombre };
}

async function main() {
  // ── Admin principal ────────────────────────────────────────────────────────
  const admin1Password = process.env.ADMIN_PASSWORD;
  if (!admin1Password) {
    throw new Error(
      'La variable de entorno ADMIN_PASSWORD es requerida. ' +
        'Defínela antes de ejecutar el seed.',
    );
  }

  const admin1 = {
    email: process.env.ADMIN_EMAIL || 'admin@uvm.cl',
    password: admin1Password,
    nombre: process.env.ADMIN_NOMBRE || 'Administrador UVM',
  };

  const hash1 = await bcrypt.hash(admin1.password, SALT_ROUNDS);

  // Crear o actualizar el usuario base
  const result1 = await prisma.usuario.upsert({
    where: { email: admin1.email },
    update: {
      nombre: admin1.nombre,
      password_hash: hash1,
      activo: true,
    },
    create: {
      nombre: admin1.nombre,
      email: admin1.email,
      password_hash: hash1,
      activo: true,
    },
  });

  // Crear el registro de Admin asociado si no existe
  await prisma.admin.upsert({
    where: { usuario_id: result1.id },
    update: {},
    create: {
      usuario_id: result1.id,
    },
  });

  console.log(`✅ Admin principal creado/actualizado: ${result1.email} (id: ${result1.id})`);

  // ── Admin secundario (opcional) ────────────────────────────────────────────
  const admin2 = readAdminEnv(
    'ADMIN2_EMAIL',
    'ADMIN2_PASSWORD',
    'ADMIN2_NOMBRE',
    'admin2@uvm.cl',
    'Administrador UVM 2',
  );

  if (admin2) {
    const hash2 = await bcrypt.hash(admin2.password, SALT_ROUNDS);

    // Crear o actualizar el usuario base
    const result2 = await prisma.usuario.upsert({
      where: { email: admin2.email },
      update: {
        nombre: admin2.nombre,
        password_hash: hash2,
        activo: true,
      },
      create: {
        nombre: admin2.nombre,
        email: admin2.email,
        password_hash: hash2,
        activo: true,
      },
    });

    // Crear el registro de Admin asociado si no existe
    await prisma.admin.upsert({
      where: { usuario_id: result2.id },
      update: {},
      create: {
        usuario_id: result2.id,
      },
    });

    console.log(`✅ Admin secundario creado/actualizado: ${result2.email} (id: ${result2.id})`);
  } else {
    console.log(
      'ℹ️  Admin secundario omitido (ADMIN2_PASSWORD no definida).',
    );
  }

  console.log('🌱 Seed completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
