import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DeportesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.deporte.findMany({
            where: { activo : true},
            orderBy: { nombre : 'asc' },
        });
    }

    async crear(dto: { nombre: string }) {
        const deporteExiste = await this.prisma.deporte.findFirst({
            where: { nombre: { equals: dto.nombre, mode: 'insensitive' } },
        });

        if (deporteExiste) {
            throw new ConflictException(`El deporte "${dto.nombre}" ya existe`);
        }

        return this.prisma.deporte.create({
            data: {
                nombre: dto.nombre,
                activo: true,
            },
        });
    }

    async editar(id: string, dto: { nombre: string }) {
        const deporte = await this.prisma.deporte.findUnique({
            where: { id },
        })

        if (!deporte){
            throw new NotFoundException('Deporte no encontrado');
        }

        const deporteMismoNombre = await this.prisma.deporte.findFirst({
            where: { nombre: { equals: dto.nombre, mode: 'insensitive' } },
        });

        if (deporteMismoNombre && deporteMismoNombre.id !== id) {
            throw new ConflictException(`El deporte "${dto.nombre}" ya existe`);
        }

        return this.prisma.deporte.update({
            where : {id},
            data : {nombre: dto.nombre}
        })
    }

    async eliminar(id: string) {
        const deporte = await this.prisma.deporte.findUnique({
            where: { id },
            // Incluimos los estudiantes para validar antes de eliminar
            include: { _count: { select: { estudiantes: true } } },
        });

        if (!deporte) {
            throw new NotFoundException('Deporte no encontrado');
        }

        // No permitir eliminar si hay estudiantes asignados
        if (deporte._count.estudiantes > 0) {
            throw new BadRequestException(
                `No se puede eliminar: hay ${deporte._count.estudiantes} estudiante(s) asignados a este deporte`,
            );
        }

        // Soft delete: marcamos como inactivo en vez de borrar el registro
        return this.prisma.deporte.update({
            where: { id },
            data: { activo: false },
        });
    }

}