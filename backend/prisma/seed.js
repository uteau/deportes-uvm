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
  // ── Admin principal (obligatorio) ────────────────────────────────────────
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

  await prisma.admin.upsert({
    where: { usuario_id: result1.id },
    update: {},
    create: {
      usuario_id: result1.id,
    },
  });

  console.log(`Admin #1 creado/actualizado: ${result1.email} (id: ${result1.id})`);

  // ── Admin secundario (opcional) ──────────────────────────────────────────
  const admin2 = readAdminEnv(
    'ADMIN2_EMAIL',
    'ADMIN2_PASSWORD',
    'ADMIN2_NOMBRE',
    'admin2@uvm.cl',
    'Administrador UVM 2',
  );

  if (admin2) {
    const hash2 = await bcrypt.hash(admin2.password, SALT_ROUNDS);

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

    await prisma.admin.upsert({
      where: { usuario_id: result2.id },
      update: {},
      create: {
        usuario_id: result2.id,
      },
    });

    console.log(`Admin #2 creado/actualizado: ${result2.email} (id: ${result2.id})`);
  } else {
    console.log('ℹ Admin #2 omitido (ADMIN2_PASSWORD no definida).');
  }

  // ── Admin terciario (opcional) ──────────────────────────────────────────
  const admin3 = readAdminEnv(
    'ADMIN3_EMAIL',
    'ADMIN3_PASSWORD',
    'ADMIN3_NOMBRE',
    'admin3@uvm.cl',
    'Administrador UVM 3',
  );

  if (admin3) {
    const hash3 = await bcrypt.hash(admin3.password, SALT_ROUNDS);

    const result3 = await prisma.usuario.upsert({
      where: { email: admin3.email },
      update: {
        nombre: admin3.nombre,
        password_hash: hash3,
        activo: true,
      },
      create: {
        nombre: admin3.nombre,
        email: admin3.email,
        password_hash: hash3,
        activo: true,
      },
    });

    await prisma.admin.upsert({
      where: { usuario_id: result3.id },
      update: {},
      create: {
        usuario_id: result3.id,
      },
    });

    console.log(`Admin #3 creado/actualizado: ${result3.email} (id: ${result3.id})`);
  } else {
    console.log(' Admin #3 omitido (ADMIN3_PASSWORD no definida).');
  }

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });