import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { CrearContactoDto } from './dto/crear-contacto.dto';
import { ActualizarContactoDto } from './dto/actualizar-contacto.dto';

// Accesible para cualquier usuario autenticado (estudiante o admin)
@Controller('contactos')
@UseGuards(JwtAuthGuard)
export class ContactosController {
    constructor(private readonly contactosService: ContactosService) {}

    // GET /api/contactos
    @Get()
    findAll() {
      return this.contactosService.findAll();
    }
}

@Controller('admin/contactos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ContactosAdminController {
    constructor(private readonly contactosService: ContactosService) {}

    @Post()
    crear(@Body() dto: CrearContactoDto) {
      return this.contactosService.crear(dto);
    }

    @Put(':id')
    actualizar(@Param('id') id: string, @Body() dto: ActualizarContactoDto) {
      return this.contactosService.actualizar(id, dto);
    }

    @Delete(':id')
    eliminar(@Param('id') id: string) {
      return this.contactosService.eliminar(id);
    }
}
