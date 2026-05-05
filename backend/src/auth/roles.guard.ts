import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UseGuards } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
// import { Observable } from "rxjs";
// import { fromReadableStreamLike } from "rxjs/internal/observable/innerFrom";

@Injectable()
export class RolesGuard implements CanActivate {

    // Reflector es el servicio de NestJS que permite leer metadata de decoradores
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Leemos los roles requeridos que adjuntó @Roles() en el controlador
        // getAllAndOverride busca primero en el método, luego en la clase
        const rolesRequeridos = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(), // metadata del método específico
            context.getClass(),   // metadata del controlador completo
        ]);
        // Si no hay @Roles() definido, dejamos pasar (no hay restricción de rol)
        if (!rolesRequeridos) return true;

        // request.user lo pone JwtAuthGuard después de validar el token
        const request = context.switchToHttp().getRequest();
        const usuario = request.user;
        if (!usuario || !rolesRequeridos.includes(usuario.rol)) {
            throw new ForbiddenException('No tienes permisos para acceder a este recurso');
        }

        return true;
    }
}