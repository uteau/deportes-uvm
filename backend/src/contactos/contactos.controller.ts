import { Controller, Get, UseGuards } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Accesible para cualquier usuario autenticado (estudiante o admin)
@Controller('contactos')
@UseGuards(JwtAuthGuard)
export class ContactosController {
  constructor(private readonly contactosService: ContactosService) {}

  // GET /api/contactos
  @Get()
  findAll() {
    return this.contactosService.findAll();
  }
}