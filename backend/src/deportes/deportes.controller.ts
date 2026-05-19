import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { DeportesService } from './deportes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { CrearDeporteDto } from './dto/crear-deporte.dto';

@Controller('admin/deportes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class DeportesController {
    constructor(private readonly deportesService: DeportesService) {}

    // GET /api/admin/deportes
    @Get()
    findAll() {
        return this.deportesService.findAll();
    }

    // POST /api/admin/deportes
    @Post()
    crear(@Body() dto: CrearDeporteDto) {
        return this.deportesService.crear(dto);
    }

    // DELETE /api/admin/deportes/:id
    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.deportesService.eliminar(id);
    }
}