import { Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    Put, 
    Query, 
    Request, 
    UseGuards } from "@nestjs/common";
import { PartidosService } from "./partidos.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { CrearPartidoDto } from "./dto/crear-partido.dto";
import { ActualizarPartidoDto } from "./dto/actualizar-partido.dto";
import { ActualizarEstadoPartidoDto } from "./dto/actualizar-estado-partido.dto";

// === Rutas públicas ======================================
@Controller('partidos')
export class PartidosController {
    constructor (private readonly partidosService: PartidosService) {}

    // GET /api/partidos
    @Get()
    findAll(@Query('date') date?: string) {
        if (date) {
            return this.partidosService.findByDate(date);
        }
        return this.partidosService.findAll();
    }

    // GET /api/partidos/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.partidosService.findOne(id);
    }
}

// === Rutas admin ======================================
// Todas las rutas de este controlador requieren JWT de admin
@Controller('admin/partidos')
@UseGuards(JwtAuthGuard, RolesGuard) // aplicamos los dos guards a todo el controlador
@Roles('admin')
export class PartidosAdminController {
    constructor(private readonly partidosService: PartidosService) {}

    @Get()
    findAllAdmin() {
        return this.partidosService.findAllAdmin();
    }

    // Crear, editar y borrar partido

    @Post()
    crear(@Body() dto: CrearPartidoDto, @Request() req) {
        // req.user viene del JwtAuthGuard; contiene el payload del JWT (id/sub, email, rol)
        // sub es la convención de nombre de JWT para id
        return this.partidosService.crear(dto, req.user.sub);
    }

    @Put(':id')
    actualizar(@Param('id') id: string, @Body() dto: ActualizarPartidoDto) {
        return this.partidosService.actualizar(dto, id);
    }

    @Patch(':id')
    activar(@Param('id') id: string, @Body() dto: ActualizarEstadoPartidoDto) {
        return this.partidosService.activar(id, dto);
    }
}