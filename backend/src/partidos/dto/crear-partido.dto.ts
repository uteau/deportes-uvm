// importamos los decoradores de validación
import{
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';


export class CrearPartidoDto {
    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})    
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;
    
    @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD (ISO8601)'})
    @IsNotEmpty({message: 'La fecha del evento es obligatoria'})   
    fecha_partido: string;
    
    @IsString()
    @IsNotEmpty({message: 'El lugar es obligatorio'})   
    lugar: string;
    
    @IsString()
    @IsNotEmpty({message: 'El equipo local es obligatorio'})   
    equipo_local: string;
    
    @IsString()
    @IsNotEmpty({message: 'El equipo visita es obligatorio'})   
    equipo_visita: string;
    
    @IsOptional()
    @IsInt({ message: 'El resultado local debe ser un número entero'})
    @Min(0)
    resul_local?: number;
    
    @IsOptional()
    @IsInt({ message: 'El resultado local debe ser un número entero'})
    @Min(0)
    resul_visita?: number;
}