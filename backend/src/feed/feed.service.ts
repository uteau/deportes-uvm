import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeedService {
    constructor(private readonly prisma: PrismaService) {}
    
    async verFeed() {
        const eventos = await this.prisma.evento.findMany({
            where: { activo : true},
        });

        const partidos = await this.prisma.partido.findMany({
            where: { activo : true},
        });

        const anuncios = await this.prisma.anuncio.findMany({
            where: {  activo : true,
                    tipo: 'publico'},
        });

        const items = [
            ...eventos.map((e) => ({ ...e, tipo_item: 'evento' as const })),
            ...partidos.map((p) => ({ ...p, tipo_item: 'partido' as const })),
            ...anuncios.map((a) => ({ ...a, tipo_item: 'anuncio' as const })),
        ];

        items.sort((a,b) => {
            const fechaA = (a.fecha_actualizacion ?? a.fecha_creacion).getTime();
            const fechaB = (b.fecha_actualizacion ?? b.fecha_creacion).getTime();
            return fechaB - fechaA;
        });

        return items;
    }

    async verFeedAdmin() {
        // Sin filtros de  activo  ni is_published — el admin ve todo
        const eventos = await this.prisma.evento.findMany();
        const partidos = await this.prisma.partido.findMany();
        const anuncios = await this.prisma.anuncio.findMany();

        const items = [
            ...eventos.map((e) => ({ ...e, tipo_item: 'evento' as const,
            _sort_date: e.fecha_actualizacion ?? e.fecha_creacion })),
            ...partidos.map((p) => ({ ...p, tipo_item: 'partido' as const,
            _sort_date: p.fecha_actualizacion ?? p.fecha_creacion })),
            ...anuncios.map((a) => ({ ...a, tipo_item: 'anuncio' as const,
            _sort_date: a.fecha_actualizacion ?? a.fecha_creacion })),
        ];

        items.sort((a, b) => b._sort_date.getTime() - a._sort_date.getTime());

        return items;
    }
    
    async verFeedSeluvm() {
        const eventos = await this.prisma.evento.findMany({
            where: { activo : true },
        });

        const partidos = await this.prisma.partido.findMany({
            where: { activo : true },
        });

        const anuncios = await this.prisma.anuncio.findMany({
            where: {  activo : true, },
        });

        const items = [
            ...eventos.map((e) => ({ ...e, tipo_item: 'evento' as const })),
            ...partidos.map((p) => ({ ...p, tipo_item: 'partido' as const })),
            ...anuncios.map((a) => ({ ...a, tipo_item: 'anuncio' as const })),
        ];

        items.sort((a,b) => {
            const fechaA = (a.fecha_actualizacion ?? a.fecha_creacion).getTime();
            const fechaB = (b.fecha_actualizacion ?? b.fecha_creacion).getTime();
            return fechaB - fechaA;
        });

        return items;
    }
}