import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CrearPartidoDto } from "./dto/crear-partido.dto";
import { ActualizarPartidoDto } from "./dto/actualizar-partido.dto";


@Injectable()
export class PartidosService {
    // Inyectamos PrismaService para acceder a la base de datos
    constructor(private readonly prisma: PrismaService) {}

    // === Métodos públicos ===========================

    // devolver todos los enventos activos
    async findAll() {
        return this.prisma.partido.findMany({
            where: { activo: true },
            orderBy: { fecha_partido: 'asc' },
        });
    }

    async findByDate(date: string) {
        // Forzamos UTC con el sufijo Z para evitar ambigüedad de zona horaria
        const fecha_inicio = new Date(`${date}T00:00:00.000Z`);
        const fecha_fin = new Date(`${date}T23:59:59.999Z`);


        return this.prisma.partido.findMany({
            where: {
                fecha_partido: {gte: fecha_inicio , lte: fecha_fin },
                activo: true,
            },
            orderBy: { fecha_partido: 'asc' },
        });
    }

    // devolver partido por id
    async findOne(id: string) {
        const partido = await this.prisma.partido.findFirst({
            where: { id, activo: true},
        });

        // 404 si no existe o fue eliminado
        if (!partido){
            throw new NotFoundException('partido con id "${id}" no encontrado');
        }

        return partido;
    }

    // === Métodos admin ===========================

    // Crear partido
    async crear(dto: CrearPartidoDto, adminId: string) {
        return this.prisma.partido.create({
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                fecha_partido: new Date(dto.fecha_partido),
                lugar: dto.lugar,
                equipo_local: dto.equipo_local,
                equipo_visita: dto.equipo_visita,
                resul_local: dto.resul_local,
                resul_visita: dto.resul_visita,
                activo: true,
                creado_por: adminId, 
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date(),
            }
        })
    }

    // actualizar partido
    async actualizar(dto: ActualizarPartidoDto, id: string) {
        // verificar que el partido exista
        const partido = await this.prisma.partido.findFirst({
            where: { id, activo: true },
        });

        if (!partido) {
            throw new NotFoundException('partido con id "&{id}" no encontrado');
        }

        return this.prisma.partido.update({
            where: {id},
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                fecha_partido: new Date(dto.fecha_partido),
                lugar: dto.lugar,
                equipo_local: dto.equipo_local,
                equipo_visita: dto.equipo_visita,
                resul_local: dto.resul_local,
                resul_visita: dto.resul_visita,
                fecha_actualizacion: new Date(),
            },
        });
    }

    // desactivar partido (elminación lógica)
    async eliminar(id: string) {
       const partido = await this.prisma.partido.findFirst({
            where: { id, activo: true },
        }); 
        
        if (!partido) {
            throw new NotFoundException('partido con id "&{id}" no encontrado');
        }

        return this.prisma.partido.update({
            where: {id},
            data: { activo: false},
        });
    }
}