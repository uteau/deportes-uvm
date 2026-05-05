import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";


@Injectable()
export class EventosService {
    // Inyectamos PrismaService para acceder a la base de datos
    constructor(private readonly prisma: PrismaService) {}

    // === Métodos públicos ===========================

    // devolver todos los enventos activos
    async findAll() {
        return this.prisma.evento.findMany({
            where: { is_active: true },
            orderBy: { fecha_evento: 'asc' },
        });
    }

    // devolver evento por id
    async findOne(id: string) {
        const evento = await this.prisma.evento.findFirst({
            where: { id, is_active: true},
        });

        if (!evento){
            throw new NotFoundException{'Evento con id "${id}" no encontrado'};
        }

        return evento;
    }
    // 404 si no existe o fue eliminado

    // === Métodos admin ===========================

    // Crear evento

    // editar evento

    // desactivar evento (elminación lógica)

}