import { IsBoolean } from 'class-validator';

export class ActualizarEstadoDeporteDto {
  @IsBoolean({ message: 'parámetro "activo" debe ser true o false' })
  activo: boolean;
}