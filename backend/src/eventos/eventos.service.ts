import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CrearEventoDto } from "./dto/crear-evento.dto";
import { ActualizarEventoDto } from "./dto/actualizar-evento.dto";
import { ActualizarEstadoEventoDto } from "./dto/actualizar-estado-evento.dto";


@Injectable()
export class EventosService {
    // Inyectamos PrismaService para acceder a la base de datos
    constructor(private readonly prisma: PrismaService) {}

    // === Métodos públicos ===========================

    // devolver todos los enventos activos
    async findAll() {
        return this.prisma.evento.findMany({
            where: { activo: true },
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
                activo: true,
            },
            orderBy: { fecha_evento: 'asc' },
        });
    }

    // devolver evento por id
    async findOne(id: string) {
        const evento = await this.prisma.evento.findFirst({
            where: { id,
                 activo: true},
        });

        // 404 si no existe o fue eliminado
        if (!evento){
            throw new NotFoundException(`Evento con id ${id} no encontrado`);
        }

        return evento;
    }

    // === Métodos admin ===========================
    
    async findAllAdmin() {
        return this.prisma.evento.findMany({
            orderBy: { fecha_evento: 'asc' },
        });
    }

    // Crear evento
    async crear(dto: CrearEventoDto, adminId: string) {
        return this.prisma.evento.create({
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                // Prisma necesita un objeto Date; lo convertimos desde el string ISO
                fecha_evento: new Date(dto.fecha_evento),
                lugar: dto.lugar,
                activo: true,
                creado_por: adminId, // guardamos quién lo creó
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date(),
            }
        })
    }

    // actualizar evento
    async actualizar(dto: ActualizarEventoDto, id: string) {
        // verificar que el evento exista
        const evento = await this.prisma.evento.findFirst({
            where: { id, activo: true },
        });

        if (!evento) {
            throw new NotFoundException(`Evento con id ${id} no encontrado`);
        }

        return this.prisma.evento.update({
            where: {id},
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                fecha_evento: new Date(dto.fecha_evento),
                lugar: dto.lugar,
                fecha_actualizacion: new Date(),
            },
        });
    }

    // activar/desactivar evento (elminación lógica)
    async activar(id: string, dto: ActualizarEstadoEventoDto) {
       const evento = await this.prisma.evento.findFirst({
            where: { id },
        }); 
        
        if (!evento) {
            throw new NotFoundException(`Evento con id ${id} no encontrado`);
        }

        return this.prisma.evento.update({
            where: {id},
            data: { activo: dto.activo },
        });
    }
}