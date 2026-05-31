import {
    IsDateString,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class CrearUsuarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsEmail({}, { message: 'El email no tiene un formato válido' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsInt()
    @IsNotEmpty({ message: 'El rut del estudiante es obligatorio' })
    rut: number;

    // ID del deporte asignado (UUID de la tabla Deporte)
    @IsString()
    @IsOptional()
    deporte_id?: string;
}