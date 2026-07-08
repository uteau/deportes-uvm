import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CrearContactoDto {
    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})    
    nombre: string;

    @IsOptional()
    @IsString()
    rol?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsString()
    descripcion_servicio?: string;
}