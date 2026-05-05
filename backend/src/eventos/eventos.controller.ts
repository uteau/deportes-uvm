import { Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Request, 
    UseGuards } from "@nestjs/common";
import { EventosService } from "./eventos.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { CrearEventoDto } from "./dto/crear-evento";
import { ActualizarEventoDto } from "./dto/actualizar-evento";


// === Rutas públicas ======================================
@Controller('eventos')
export class EventosPublicosController {
    constructor (private readonly eventosService: EventosService) {}

    // Eventos publicos debe mostrar los eventos y mostrar evento por ID

    // GET /api/eventos
    @Get()
    findAll() {
        return this.eventosService.findAll();
    }

    // GET /api/eventos/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventosService.findOne(id);
    }
}

// === Rutas admin ======================================
// Todas las rutas de este controlador requieren JWT de admin
@Controller('admin/eventos')
@UseGuards(JwtAuthGuard, RolesGuard) // aplicamos los dos guards a todo el controlador
@Roles('admin')
export class EventosAdminController {
    constructor(private readonly eventosService: EventosService) {}

    // Crear, editar y borrar evento

    @Post()
    crear(@Body() dto: CrearEventoDto, @Request() req) {
        // req.user viene del JwtAuthGuard; contiene el payload del JWT (id/sub, email, rol)
        // sub es la convención de nombre de JWT para id
        return this.eventosService.crear(dto, req.user.sub);
    }

    @Put(':id')
    actualizar(@Param('id') id: string, @Body() dto: ActualizarEventoDto) {
        return this.eventosService.actualizar(dto, id);
    }

    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.eventosService.eliminar(id);
    }
}