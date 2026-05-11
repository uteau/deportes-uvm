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
                is_published: true 
            },
            orderBy: { published_at: 'desc' }
        });
    }

    async findOnePublicos(id: string) {
        const anuncio = this.prisma.anuncio.findFirst({
            where: { 
                id, 
                tipo: AnuncioTipo.PUBLICO,
                is_published: true,
            },
        });

        if (!anuncio) {
            throw new NotFoundException('Evento con id "${id}" no encontrado');
        }

        return anuncio;
    }

    // === Métodos anucios SELUVM ===========================
    async findAllSeluvm() {
        return this.prisma.anuncio.findMany({
            where: {
                tipo: AnuncioTipo.SELUVM,
                is_published: true },
            orderBy: { published_at: 'desc' }
        });
    }

    async findOneSeluvm(id: string) {
        const anuncio = this.prisma.anuncio.findFirst({
            where: { 
                id,
                tipo: AnuncioTipo.SELUVM,
                 is_published: true }
        });

        if (!anuncio) {
            throw new NotFoundException('Evento con id "${id}" no encontrado');
        }

        return anuncio;
    }

    // === Métodos admin ===========================
    async crear(dto:CrearAnuncioDto, adminId: string) {
        return this.prisma.anuncio.create({
            data: {
                titulo: dto.titulo,
                contenido: dto.contenido,
                tipo: dto.subtipo,
                instagram_url: dto.instagram_url,
                is_published: true,
                published_at: new Date(),
                created_by: adminId,
            },
        });
    }

    async actualizar(dto: ActualizarAnuncioDto, id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { id },
        });

        if (!anuncio) {
            throw new NotFoundException('Anuncio con id "&{id}" no encontrado');
        }

        const subtipoFinal = dto.subtipo ?? anuncio.tipo;
        
        return this.prisma.anuncio.update({
            where: { id },
            data: {
                titulo: dto.titulo,
                contenido: dto.contenido,
                tipo: subtipoFinal,
                instagram_url: dto.instagram_url,
            },
        });
    }

    async eliminar(id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { id },
        });

        if (!anuncio) {
            throw new NotFoundException('Anuncio con id "&{id}" no encontrado');
        }

        return this.prisma.anuncio.delete({
            where: { id },
        });
    }
}