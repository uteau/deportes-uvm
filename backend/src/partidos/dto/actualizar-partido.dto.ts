// PartialType hace que todos los campos del DTO parde sean opcionales
// Eficaz para PUT/PATCH donde se envian solo algunos campos
import { PartialType } from '@nestjs/mapped-types';
import { CrearPartidoDto } from "./crear-partido.dto";

// ActualizarEventoDto hereda todos los campos de CrearEventoDto pero todos opcionales
export class ActualizarPartidoDto extends PartialType(CrearPartidoDto) {}