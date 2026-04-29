import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UseGuards } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { fromReadableStreamLike } from "rxjs/internal/observable/innerFrom";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly rolRequerido: string) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const usuario = request.user;
        if (!usuario || usuario.rol !== this.rolRequerido) {
            throw new ForbiddenException('No tinenes permisos para accedes a este recurso');
        }
        return true;
    }
}