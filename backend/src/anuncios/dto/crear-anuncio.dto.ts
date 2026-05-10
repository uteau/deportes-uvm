import{
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf
} from 'class-validator';

export enum AnuncioSubtipo{
    PUBLICO = 'publico',
    SELUVM = 'seluvm',
}
export class CrearAnuncioDto {
    @IsString()
    @IsNotEmpty({message: 'El titulo es obligatorio'})    
    titulo: string;

    @IsString()
    @IsNotEmpty({message: 'El contenido es obligatorio'}) 
    contenido: string;

    @IsEnum(AnuncioSubtipo, {message: 'El subtipo debe ser "publico" o "seluvm"'})   
    subtipo: AnuncioSubtipo;

    @IsOptional()
    @IsString()  
    instagram_url?: string;
}