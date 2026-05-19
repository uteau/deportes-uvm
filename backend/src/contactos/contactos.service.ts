import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactosService {
  constructor(private readonly prisma: PrismaService) {}

  // Devuelve todos los contactos del área de deportes
  // No hay filtro de activos porque Contacto no tiene is_active
  async findAll() {
    return this.prisma.contacto.findMany({
      orderBy: { nombre: 'asc' },
    });
  }
}