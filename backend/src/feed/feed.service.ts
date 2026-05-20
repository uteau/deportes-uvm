import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeedService {
    constructor(private readonly prisma: PrismaService) {}
    
    async verFeed() {
        const eventos = await this.prisma.evento.findMany({
            where: {is_active: true},
        });

        const partidos = await this.prisma.partido.findMany({
            where: {is_active: true},
        });

        const anuncios = await this.prisma.anuncio.findMany({
            where: { is_published: true},
            // where: { tipo: 'publico', is_published: true},
        });

        const items = [
            ...eventos.map((e) => ({ ...e, tipo_item: 'evento' as const })),
            ...partidos.map((p) => ({ ...p, tipo_item: 'partido' as const })),
            ...anuncios.map((a) => ({ ...a, tipo_item: 'anuncio' as const })),
        ];

        items.sort((a,b) => {
            const fechaA = (a.promoted_at ?? a.created_at).getTime();
            const fechaB = (b.promoted_at ?? b.created_at).getTime();
            return fechaB - fechaA;
        });

        return items;
    }

    async verFeedAdmin() {
    // Sin filtros de is_active ni is_published — el admin ve todo
    const eventos = await this.prisma.evento.findMany();
    const partidos = await this.prisma.partido.findMany();
    const anuncios = await this.prisma.anuncio.findMany();

    const items = [
        ...eventos.map((e) => ({ ...e, tipo_item: 'evento' as const,
        _sort_date: e.promoted_at ?? e.created_at })),
        ...partidos.map((p) => ({ ...p, tipo_item: 'partido' as const,
        _sort_date: p.promoted_at ?? p.created_at })),
        ...anuncios.map((a) => ({ ...a, tipo_item: 'anuncio' as const,
        _sort_date: a.created_at })),
    ];

    items.sort((a, b) => b._sort_date.getTime() - a._sort_date.getTime());

    return items;
    }
}