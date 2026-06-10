import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto { // Data Transfer Object - clase que define la forma esperada del cuerpo de un request
  
    // Valida que el campo sea un email con formato válido.
    @IsEmail({},{ message : 'El email no tiene un formato válido' })
    email: string; 

    // Valida que sea un string con al menos 6 caracteres.
    @IsString()
    @MinLength(6,{ message : 'La contraseña debe tener al menos 6 caracteres'})
    password: string;
}