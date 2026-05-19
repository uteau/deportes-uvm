import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { UsuariosService } from "./usuarios.service";
import { CrearUsuarioDto } from "./dto/crear-usuario.dto";
import { ActualizarEstadoDto } from "./dto/actualizar-estado.dto";

@Controller('admin/usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Get()
    findAll() {
        return this.usuariosService.findAll()
    }

    @Post()
    crear(@Body() dto: CrearUsuarioDto) {
        return this.usuariosService.crear(dto);
    }

    @Patch(':id/estado')
    actualizarEstado(@Param('id') id: string, @Body() dto: ActualizarEstadoDto) {
        return this.usuariosService.actualizarEstado(id, dto);
    }
}

@Controller('seluvm')
@UseGuards(JwtAuthGuard) // Solo requiere JWT válido, cualquier rol
export class EstudianteController {
    constructor(private readonly usuariosService: UsuariosService) {}

    // GET /api/estudiante/credencial
    @Get('credencial')
    getCredencial(@Request() req) {
        // req.user.sub es el id del usuario que viene en el payload del JWT
        return this.usuariosService.getCredencial(req.user.sub);
    }
}