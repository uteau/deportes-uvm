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
                is_active: true,
            },
            orderBy: { updated_at: 'desc' }
        });
    }

    async findOnePublico(id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { 
                id, 
                tipo: AnuncioTipo.PUBLICO,
                is_active: true,
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
                is_active: true,
            },
            orderBy: { updated_at: 'desc' }
        });
    }

    async findOneSeluvm(id: string) {
        const anuncio = await this.prisma.anuncio.findFirst({
            where: { 
                id,
                tipo: AnuncioTipo.SELUVM,
                is_active: true }
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
                is_active: true,
                created_by: adminId,
                created_at: new Date(),
                updated_at: new Date(),
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
                updated_at: new Date(),
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