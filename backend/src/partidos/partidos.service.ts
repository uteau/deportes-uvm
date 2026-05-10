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
            where: { is_active: true },
            orderBy: { fecha_partido: 'asc' },
        });
    }

    // devolver partido por id
    async findOne(id: string) {
        const partido = await this.prisma.partido.findFirst({
            where: { id, is_active: true},
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
                is_active: true,
                created_by: adminId, 
            }
        })
    }

    // actualizar partido
    async actualizar(dto: ActualizarPartidoDto, id: string) {
        // verificar que el partido exista
        const partido = await this.prisma.partido.findFirst({
            where: { id, is_active: true },
        });

        if (!partido) {
            throw new NotFoundException('partido con id "&{id}" no encontrado');
        }

        return this.prisma.partido.update({
            where: {id},
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                fecha_partido: dto.fecha_partido,
                lugar: dto.lugar,
                equipo_local: dto.equipo_local,
                equipo_visita: dto.equipo_visita,
                resul_local: dto.resul_local,
                resul_visita: dto.resul_visita,
                promoted_at: new Date(),
            },
        });
    }

    // desactivar partido (elminación lógica)
    async eliminar(id: string) {
       const partido = await this.prisma.partido.findFirst({
            where: { id, is_active: true },
        }); 
        
        if (!partido) {
            throw new NotFoundException('partido con id "&{id}" no encontrado');
        }

        return this.prisma.partido.update({
            where: {id},
            data: { is_active: false},
        });
    }
}