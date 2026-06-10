import {
    IsDateString,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    Max,
    Min,
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

    @IsInt()
    @IsNotEmpty({ message: 'El dígito verificador es obligatorio' })
    @Min(0, { message: 'El dígito verificador debe ser un número entre 0-9 o K' })
    @Max(10, { message: 'El dígito verificador debe ser un número entre 0-9 o K' })
    dig_verificador: number;

    // ID del deporte asignado (UUID de la tabla Deporte)
    @IsString()
    @IsOptional()
    deporte_id?: string;
}