import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AnuncioTipo, CrearAnuncioDto } from "./dto/crear-anuncio.dto";
import { ActualizarAnuncioDto } from "./dto/actualizar-anuncio.dto";

@Injectable()
export class AnunciosService {
    constructor(private readonly prisma: PrismaService) {}

    // === Métodos anuncios públicos ===========================
    async findAllPublicos() {
        return this.prisma.anuncio.findMany({
            where: { 
                tipo: AnuncioTipo.PUBLICO,
                activo: true,
            },
            orderBy: { fecha_actualizacion: 'desc' }
        });
    }

    async findOnePublico(id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { 
                id, 
                tipo: AnuncioTipo.PUBLICO,
                activo: true,
            },
        });

        if (!anuncio) {
            throw new NotFoundException(`Anuncio con id ${id} no encontrado`);
        }

        return anuncio;
    }

    // === Métodos anucios SELUVM ===========================

    async findAllSeluvm() {
        return this.prisma.anuncio.findMany({
            where: {
                tipo: AnuncioTipo.SELUVM,
                activo: true,
            },
            orderBy: { fecha_actualizacion: 'desc' }
        });
    }

    async findOneSeluvm(id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { 
                id,
                tipo: AnuncioTipo.SELUVM,
                activo: true }
        });

        if (!anuncio) {
            throw new NotFoundException(`Anuncio con id ${id} no encontrado`);
        }

        return anuncio;
    }

    // === Métodos admin ===========================

    async findAllPublicosAdmin() {
        return this.prisma.anuncio.findMany({
            where: { tipo: AnuncioTipo.PUBLICO },
            orderBy: { fecha_actualizacion: 'desc' },
        });
    }

    // Admin: todos los anuncios SelUVM, activos e inactivos
    async findAllSeluvmAdmin() {
        return this.prisma.anuncio.findMany({
            where: { tipo: AnuncioTipo.SELUVM },
            orderBy: { fecha_actualizacion: 'desc' },
        });
    }

    async crear(dto:CrearAnuncioDto, adminId: string) {
        return this.prisma.anuncio.create({
            data: {
                titulo: dto.titulo,
                contenido: dto.contenido,
                tipo: dto.tipo,
                instagram_url: dto.instagram_url,
                activo: true,
                creado_por: adminId,
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date(),
            },
        });
    }

    async actualizar(dto: ActualizarAnuncioDto, id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { id },
        });

        if (!anuncio) {
            throw new NotFoundException(`Anuncio con id ${id} no encontrado`);
        }

        const subtipoFinal = dto.tipo ?? anuncio.tipo;
        
        return this.prisma.anuncio.update({
            where: { id },
            data: {
                titulo: dto.titulo,
                contenido: dto.contenido,
                tipo: subtipoFinal,
                instagram_url: dto.instagram_url,
                fecha_actualizacion: new Date(),
            },
        });
    }

    async eliminar(id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { id , activo: true},
        });

        if (!anuncio) {
            throw new NotFoundException(`Anuncio con id ${id} no encontrado`);
        }

        return this.prisma.anuncio.update({
            where: { id },
            data: { activo: false },
        });
    }
}