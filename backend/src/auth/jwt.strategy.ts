import { Injectable, UnauthorizedException } from '@nestjs/common';
// clase base de NestJS para definir estrategias de auth.
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly prisma: PrismaService) {
        // super() configura la estrategia con dos parámetros clave:
        super({
            // fromAuthHeaderAsBearerToken() lee el token del header:
            // Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // El mismo secreto que se usó para firmar el token.
            // Lo leemos desde las variables de entorno.
            secretOrKey: process.env.JWT_SECRET,
        });
    }
    // validate() se ejecuta automáticamente después de verificar el token.
    // El payload contiene los datos que firmamos en el token (sub, email, rol).
    // Lo que retornemos aquí se adjunta a request.user en los controladores.
    async validate(payload: { sub: string; email: string; rol: string }) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id: payload.sub},
        });

        if (!usuario || !usuario.activo) {
            throw new UnauthorizedException('Cuenta inactiva o inexistente');
        }

        return {
            sub: payload.sub,
            email: payload.email,
            rol: payload.rol,
        };
    }
}