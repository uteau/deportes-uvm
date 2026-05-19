import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearDeporteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;
}