import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AnunciosService } from "./anuncios.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { CrearAnuncioDto } from "./dto/crear-anuncio.dto";
import { ActualizarAnuncioDto } from "./dto/actualizar-anuncio.dto";
import { ActualizarEstadoAnuncioDto } from "./dto/actualizar-estado-anuncio.dto";

// === Rutas públicas ======================================
@Controller('anuncios/publico')
export class AnunciosPublicosController {
    constructor (private readonly anunciosService: AnunciosService) {}
    
    @Get()
    findAll() {
        return this.anunciosService.findAllPublicos();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.anunciosService.findOnePublico(id);
    }
}

// === Rutas SelUVM ======================================
@Controller('anuncios/seluvm')
@UseGuards(JwtAuthGuard)
export class AnunciosSeluvmController {
    constructor (private readonly anunciosService: AnunciosService) {}
    
    @Get()
    findAll() {
        return this.anunciosService.findAllSeluvm();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.anunciosService.findOneSeluvm(id);
    }
}

// === Rutas admin ======================================
@Controller('admin/anuncios')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('admin')
export class AnunciosAdminController {
    constructor (private readonly anunciosService: AnunciosService) {}
    
    @Get('publico')
    findAllPublicosAdmin() {
        return this.anunciosService.findAllPublicosAdmin();
    }

    // GET /api/admin/anuncios/seluvm — todos los SelUVM, activos e inactivos
    @Get('seluvm')
    findAllSeluvmAdmin() {
        return this.anunciosService.findAllSeluvmAdmin();
    }

    @Post()
    crear(@Body() dto: CrearAnuncioDto, @Request() req) {
        return this.anunciosService.crear(dto, req.user.sub);
    }

    @Put(':id')
    actualizar(@Param('id') id: string, @Body() dto: ActualizarAnuncioDto) {
        return this.anunciosService.actualizar(dto, id);
    }

    @Patch(':id')
    activar(@Param('id') id: string, @Body() dto: ActualizarEstadoAnuncioDto) {
        return this.anunciosService.activar(id, dto);
    }
}

