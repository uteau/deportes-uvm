import { PartialType } from '@nestjs/mapped-types';
import { CrearDeporteDto } from './crear-deporte.dto';

export class ActualizarDeporteDto extends PartialType(CrearDeporteDto) {}