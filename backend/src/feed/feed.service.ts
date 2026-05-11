import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeedService {
    constructor(private readonly prisma: PrismaService) {}
    
    async getFeed() {
        const eventos = await this.prisma.evento.findMany({
            where: {is_active: true},
        });

        const partidos = await this.prisma.partido.findMany({
            where: {is_active: true},
        });

        const anuncios = await this.prisma.anuncio.findMany({
            where: { tipo: 'publico', is_published: true},
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
}