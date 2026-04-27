import { Injectable } from '@nestjs/common';
// clase base de NestJS para definir estrategias de auth.
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
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
    validate(payload: { sub: string; email: string, rol: string }) {
        return {
            id: payload.sub,
            email: payload.email,
            rol: payload.rol,
        };
    }
}