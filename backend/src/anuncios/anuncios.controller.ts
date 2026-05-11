import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AnunciosService } from "./anuncios.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { CrearAnuncioDto } from "./dto/crear-anuncio.dto";
import { ActualizarAnuncioDto } from "./dto/actualizar-anuncio.dto";

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
    
    @Post()
    crear(@Body() dto: CrearAnuncioDto, @Request() req) {
        return this.anunciosService.crear(dto, req.user.sub);
    }

    @Put(':id')
    actualizar(@Param('id') id: string, @Body() dto: ActualizarAnuncioDto) {
        return this.anunciosService.actualizar(dto, id);
    }

    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.anunciosService.eliminar(id);
    }
}