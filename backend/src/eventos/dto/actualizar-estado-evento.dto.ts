import { IsBoolean } from 'class-validator';

export class ActualizarEstadoEventoDto {
  // Solo recibe true o false para activar/desactivar la cuenta
  @IsBoolean({ message: 'parámetro "activo" debe ser true o false' })
  activo: boolean;
}