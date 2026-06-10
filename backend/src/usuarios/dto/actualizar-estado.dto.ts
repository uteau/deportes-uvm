import { IsBoolean } from 'class-validator';

export class ActualizarEstadoDto {
  // Solo recibe true o false para activar/desactivar la cuenta
  @IsBoolean({ message: 'parámetro "activo" debe ser true o false' })
  activo: boolean;
}