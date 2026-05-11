'use strict';

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('uvm2026', 10);

  // Crear el usuario base
  const usuario = await prisma.usuario.upsert({
    where: { email: 'est@test.cl' },
    update: {},
    create: {
      nombre: 'Bruno Test',
      email: 'est@test.cl',
      password_hash: hash,
      is_active: true,
    },
  });

  // Crear el registro de estudiante vinculado al usuario
  await prisma.estudiante.upsert({
    where: { usuario_id: usuario.id },
    update: {},
    create: {
      estudiante_id: 'EST001',
      usuario_id: usuario.id,
    },
  });

  console.log(`✅ Estudiante creado: ${usuario.email}`);
}

main()
  .catch((e) => { console.error('❌', e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });