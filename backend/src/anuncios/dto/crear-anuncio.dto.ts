import{
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

export enum AnuncioTipo{
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

    @IsEnum(AnuncioTipo, {message: 'El tipo debe ser "publico" o "seluvm"'})   
    tipo: AnuncioTipo;

    @IsOptional()
    @IsUrl({}, { message: 'El enlace debe ser una URL válida'})  
    instagram_url?: string;
}