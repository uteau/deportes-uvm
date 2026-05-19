import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto } from './crear-usuario.dto';

// ActualizarEventoDto hereda todos los campos de CrearEventoDto pero todos opcionales
export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {}