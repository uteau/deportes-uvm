import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CrearEventoDto } from "./dto/crear-evento.dto";
import { ActualizarEventoDto } from "./dto/actualizar-evento.dto";


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

    async findByDate(date: string) {
        // Forzamos UTC con el sufijo Z para evitar ambigüedad de zona horaria
        const fecha_inicio = new Date(`${date}T00:00:00.000Z`);
        const fecha_fin = new Date(`${date}T23:59:59.999Z`);


        return this.prisma.evento.findMany({
            where: {
                fecha_evento: {gte: fecha_inicio , lte: fecha_fin },
                is_active: true,
            },
            orderBy: { fecha_evento: 'asc' },
        });
    }

    // devolver evento por id
    async findOne(id: string) {
        const evento = await this.prisma.evento.findFirst({
            where: { id, is_active: true},
        });

        // 404 si no existe o fue eliminado
        if (!evento){
            throw new NotFoundException('Evento con id "${id}" no encontrado');
        }

        return evento;
    }

    // === Métodos admin ===========================

    // Crear evento
    async crear(dto: CrearEventoDto, adminId: string) {
        return this.prisma.evento.create({
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                // Prisma necesita un objeto Date; lo convertimos desde el string ISO
                fecha_evento: new Date(dto.fecha_evento),
                lugar: dto.lugar,
                is_active: true,
                created_by: adminId, // guardamos quién lo creó
                created_at: new Date(),
                updated_at: new Date(),
            }
        })
    }

    // actualizar evento
    async actualizar(dto: ActualizarEventoDto, id: string) {
        // verificar que el evento exista
        const evento = await this.prisma.evento.findFirst({
            where: { id, is_active: true },
        });

        if (!evento) {
            throw new NotFoundException('Evento con id "&{id}" no encontrado');
        }

        return this.prisma.evento.update({
            where: {id},
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                fecha_evento: dto.fecha_evento,
                lugar: dto.lugar,
                updated_at: new Date(),
            },
        });
    }

    // desactivar evento (elminación lógica)
    async eliminar(id: string) {
       const evento = await this.prisma.evento.findFirst({
            where: { id, is_active: true },
        }); 
        
        if (!evento) {
            throw new NotFoundException('Evento con id "&{id}" no encontrado');
        }

        return this.prisma.evento.update({
            where: {id},
            data: { is_active: false},
        });
    }
}