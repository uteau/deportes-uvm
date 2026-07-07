import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

// Este archivo declara la lógica de autorización de usuario.
// Busca usuario, verifica contraseña, determina rol según relaciones y genera token de sesión.

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    async login(dto: LoginDto) {
        // Buscar el usuario con sus relaciones admin y estudiante
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
            include: {
                admin: true,
                estudiante: true,
            },
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        // Verificar que la contraseña coincide con el hash almacenado.
        // bcrypt.compare() compara el texto plano con el hash de forma segura.
        const passwordValida = await bcrypt.compare(
            dto.password,
            usuario.password_hash,
        );

        if (!passwordValida) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        if (!usuario.activo) {
            throw new UnauthorizedException('Cuenta desactivada');
        }

        // Determinar el rol según la existencia de registros relacionados
        let rol: string;
        if (usuario.admin) {
            rol = 'admin';
        } else if (usuario.estudiante) {
            rol = 'estudiante';
        } else {
            // Usuario sin rol asignado (no debería ocurrir en producción)
            throw new UnauthorizedException('Usuario sin rol asignado');
        }

        // Determinar la duración del token según el rol.
        // Admin: 4 horas. Estudiante: 8 horas.
        const expiresIn = rol === 'admin' ? '4h' : '8h';

        // payload es la porción de datos necesarios para la codificación del JWT
        const payload = {
            sub: usuario.id, // "sub" es la convención JWT para el ID del usuario
            email: usuario.email,
            rol: rol,
        };

        const accessToken = this.jwt.sign(payload, { expiresIn });

        // Actualizar ultimo_ingreso con la fecha y hora actual.
        await this.prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultimo_ingreso: new Date() },
        });

        // Devolver el token y el rol para que el frontend redirija al módulo correcto.
        return {
            accessToken,
            rol: rol,
        };
    }

    // El logout en el backend no hace nada con el token (no hay blacklist).
    // Solo devuelve 200. El cliente es responsable de eliminarlo localmente.
    logout() {
        return { message: 'Sesión cerrada correctamente' };
    }
}