// importamos los decoradores de validación
import{
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
    ValidateIf
} from 'class-validator';

// export enum EventoSubtipo{
//     PARTIDO = 'partido',
//     EVENTO_PUBLICO = 'evento_publico',
// }

export class CrearEventoDto {
    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})    
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;
    
    @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD (ISO8601)'})
    @IsNotEmpty({message: 'La fecha del evento es obligatoria'})   
    fecha_evento: string;
    
    @IsString()
    @IsNotEmpty({message: 'El lugar es obligatorio'})   
    lugar: string;
}