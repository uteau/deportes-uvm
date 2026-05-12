import { IsDateString, 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    MinLength 
} from "class-validator";

export class CrearUsuarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio'})
    nombre: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres'})
    password: string;
    
    @IsString()
    @IsNotEmpty({ message: 'El número de identificación del estudiante es obligatorio'})
    estudiante_id: string;
    
    @IsString()
    @IsOptional()
    deporte_id: string;

    // Fecha de vencimiento de la credencial digital (opcional)
    @IsDateString({}, { message: 'La fecha debe tener formato ISO8601' })
    @IsOptional()
    credential_expires_at?: string;
}