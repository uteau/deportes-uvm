import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearContactoDto } from './dto/crear-contacto.dto';
import { ActualizarContactoDto } from './dto/actualizar-contacto.dto';

@Injectable()
export class ContactosService {
    constructor(private readonly prisma: PrismaService) {}

    // Devuelve todos los contactos del área de deportes
    // No hay filtro de activos porque Contacto no tiene activo
    async findAll() {
        return this.prisma.contacto.findMany({
          orderBy: { nombre: 'asc' },
        });
    }

    async crear(dto: CrearContactoDto) {
        return this.prisma.contacto.create({
            data: {
                nombre: dto.nombre,
                rol: dto.rol,
                email: dto.email,
                telefono: dto.telefono,
                descripcion_servicio: dto.descripcion_servicio,
            }
        })
    }
    
    async actualizar(id: string, dto: ActualizarContactoDto) {
        const contacto = await this.prisma.contacto.findFirst({
          where: { id }
        });

        if (!contacto) {
            throw new NotFoundException(`Contacto con id ${id} no encontrado`);
        }

        return this.prisma.contacto.update({
            where: { id },
            data: {
                nombre: dto.nombre,
                rol: dto.rol,
                email: dto.email,
                telefono: dto.telefono,
                descripcion_servicio: dto.descripcion_servicio,
            },
        })
    }

    async eliminar(id: string) {
        const contacto = await this.prisma.contacto.findFirst({
          where: { id }
        });

        if (!contacto) {
            throw new NotFoundException(`Contacto con id ${id} no encontrado`);
        }

        return this.prisma.contacto.delete({
            where: { id },
        });
    }
}
