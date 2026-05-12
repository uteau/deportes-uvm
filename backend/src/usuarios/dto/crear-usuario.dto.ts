import { IsNotEmpty, IsString } from "class-validator";

export class CrearUsuarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio'})
    nombre: string;
    
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio'})
    email: string;
    
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio'})
    password: string;
    
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio'})
    estudiante_id: string;
    
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio'})
    deporte_id: string;

    
}