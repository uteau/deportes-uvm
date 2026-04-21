require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

// Crear el adaptador de conexión usando la URL de la base de datos
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Instancia del cliente de Prisma usando el adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const nombreAdmin = process.env.ADMIN_NOMBRE;
    
    if (!email || !password || !nombreAdmin) {
        throw new Error('Faltan variables de entorno.');
    }

    const existe = await prisma.usuario.findUnique({
        where: { email },
    });

    // if (existe) {
    //     console.log(`El administrador ${email} ya existe. No se creó uno nuevo.`);
    //     return;
    // }

    // Hashear la contraseña con bcrypt (10 es el número de rondas de encriptación)
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.usuario.upsert({
        where: { email },
        update: {},
        create: {
            nombre: nombreAdmin,
            email,
            password_hash: passwordHash,
            rol: 'admin',
            is_active: true,
        },
    });

    console.log(`Admin creado: ${admin.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });