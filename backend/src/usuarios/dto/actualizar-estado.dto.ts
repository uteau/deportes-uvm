import { IsBoolean } from 'class-validator';

export class ActualizarEstadoDto {
  // Solo recibe true o false para activar/desactivar la cuenta
  @IsBoolean({ message: 'is_active debe ser true o false' })
  is_active: boolean;
}