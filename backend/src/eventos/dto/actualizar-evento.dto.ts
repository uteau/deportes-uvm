// PartialType hace que todos los campos del DTO parde sean opcionales
// Eficaz para PUT/PATCH donde se envian solo algunos campos
import { PartialType } from '@nestjs/mapped-types';
import { CrearEventoDto } from "./crear-evento.dto";

// ActualizarEventoDto hereda todos los campos de CrearEventoDto pero todos opcionales
export class ActualizarEventoDto extends PartialType(CrearEventoDto) {}