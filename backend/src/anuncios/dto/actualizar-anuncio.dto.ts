// PartialType hace que todos los campos del DTO parde sean opcionales
// Eficaz para PUT/PATCH donde se envian solo algunos campos
import { PartialType } from '@nestjs/mapped-types';
import { CrearAnuncioDto } from './crear-anuncio.dto';

// ActualizarAnuncioDto hereda todos los campos de CrearAnuncioDto pero todos opcionales
export class ActualizarAnuncioDto extends PartialType(CrearAnuncioDto) {}