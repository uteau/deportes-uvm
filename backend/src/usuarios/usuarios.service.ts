import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CrearUsuarioDto } from "./dto/crear-usuario.dto";
import * as bcrypt from 'bcrypt';
import { ActualizarEstadoDto } from "./dto/actualizar-estado.dto";

const CICLOS = 10;

@Injectable()
export class UsuariosService {
    constructor(private readonly prisma: PrismaService) {}

    // Listar todos los estudiantes
    async findAll() {
        return this.prisma.estudiante.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        is_active: true,
                        created_at: true,
                    },
                },
                deporte: {
                    select: {id: true, nombre: true},
                },
            },
        });
    }

    // Crear cuenta de estudiante
    async crear(dto: CrearUsuarioDto) {
        // validaciones de email y de id estudiante
        const emailExiste = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
        });
        if (emailExiste) {
            throw new ConflictException('El email ya está registrado.')
        }
        const idExiste = await this.prisma.estudiante.findUnique({
            where: { estudiante_id: dto.estudiante_id },
        });
        if (idExiste) {
            throw new ConflictException('El número de identificación del estudiante ya está registrado.')
        }

        // hash de la contraseña para guardar
        const password_hash = await bcrypt.hash(dto.password, CICLOS)

        return this.prisma.$transaction( async (tx) => {
            // registro base de usuario
            const usuario = await tx.usuario.create({
                data: {
                    nombre: dto.nombre,
                    email: dto.email,
                    password_hash,
                    is_active: true,
                },
            });
            
            const estudiante = await tx.estudiante.create({
                data: {
                    usuario_id: usuario.id,
                    estudiante_id: dto.estudiante_id,
                    deporte_id: dto.deporte_id,
                    credential_expires_at: dto.credential_expires_at
                        ? new Date(dto.credential_expires_at)
                        : null,
                },
            });
            
            return { usuario, estudiante };
        });

    }

    async actualizarEstado(id: string, dto: ActualizarEstadoDto) {
        const usuario = await this.prisma.usuario.findFirst({
            where: {id},
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return this.prisma.usuario.update({
            where: { id },
            data: {is_active: dto.is_active},
        });
    }
}