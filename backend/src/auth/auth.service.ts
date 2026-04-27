import { Injectable, UnauthorizedException } from "@nestjs/common";
import{ JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

// Este archivo declara la logica de autorización de usuario
// Busca usuario, verifica contraseña y genera token de sesión.

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    async login (dto: LoginDto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
        });

        if (!usuario){
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        // Verificar que la contraseña coincide con el hash almacenado.
        // bcrypt.compare() compara el texto plano con el hash de forma segura.
        const passwordValida = await bcrypt.compare(dto.password, usuario.password_hash);

        if (!passwordValida) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        // Determinar la duración del token según el rol.
        // Admin: 4 horas. Estudiante: 8 horas.
        const expiresIn = usuario.rol === 'admin' ? '4h' : '8h';

        // payload es la porcion de datos necesarios para la codificación del JWT
        const payload = {
            sub: usuario.id, // "sub" es la convención JWT para el ID del usuario
            email: usuario.email,
            rol: usuario.rol,
        };

        const accessToken = this.jwt.sign(payload, { expiresIn });

        // Actualizar last_login con la fecha y hora actual.
        await this.prisma.usuario.update({
            where: {id: usuario.id},
            data: {last_login: new Date()},
        });

        // Devolver el token y el rol para que el frontend redirija al módulo correcto.
        return {
            accessToken,
            rol: usuario.rol,
        };
    }

    // El logout en el backend no hace nada con el token (no hay blacklist).
    // Solo devuelve 200. El cliente es responsable de eliminarlo localmente.
    logout() {
        return { message: 'Sesión cerrada correctamente' };
    }
}