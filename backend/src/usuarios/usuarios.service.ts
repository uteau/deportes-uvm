import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CrearUsuarioDto } from "./dto/crear-usuario.dto";
import * as bcrypt from 'bcrypt';
import { ActualizarEstadoDto } from "./dto/actualizar-estado.dto";
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto";

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

    // async findOne(id: string) {
    //     const estudiante = await this.prisma.estudiante.findUnique({
    //         where: { usuario_id: id },
    //         include: {
    //             usuario: {
    //                 select: {
    //                     id: true,
    //                     nombre: true,
    //                     email: true,
    //                 },
    //             },
    //             deporte: {
    //                 select: {id: true, nombre: true},
    //             },
    //         },
    //     });
        
    //     if (!estudiante) {
    //         throw new NotFoundException('Usuario no encontrado');
    //     }
        
    //     return estudiante;
    // }

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
                },
            });
            
            return { usuario, estudiante };
        });
    }

    async actualizar(id: string, dto: ActualizarUsuarioDto) {
        const usuario = await this.prisma.usuario.findFirst({
            where: {id},
        });

        const estudiante = await this.prisma.estudiante.findFirst({
            where: {usuario_id: id},
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (dto.email && dto.email !== usuario.email) {
            const emailExiste = await this.prisma.usuario.findUnique({
                where: { email: dto.email },
            });
            if (emailExiste) {
                throw new ConflictException(`El email ${dto.email} ${usuario.email} ya está registrado.`);
            }
        }

        if (dto.estudiante_id && dto.estudiante_id !== estudiante.estudiante_id) {
            const idExiste = await this.prisma.estudiante.findUnique({
                where: { estudiante_id: dto.estudiante_id },
            });
            if (idExiste) {
                throw new ConflictException('El número de identificación del estudiante ya está registrado.')
            }
        }

        let password_hash: string | undefined = undefined;
    
        if (dto.password && dto.password.trim() !== '') {
            password_hash = await bcrypt.hash(dto.password, CICLOS);
        }

        return this.prisma.$transaction( async (tx) => {
            const usuarioData: any = {};
            if (dto.nombre !== undefined) usuarioData.nombre = dto.nombre;
            if (dto.email !== undefined) usuarioData.email = dto.email;
            if (password_hash !== undefined) usuarioData.password_hash = password_hash;

            let usuarioActualizado = usuario;
            if (Object.keys(usuarioData).length > 0) {
                usuarioActualizado = await tx.usuario.update({
                    where: { id },
                    data: usuarioData,
                });
            }

            const estudianteData: any = {};
            if (dto.estudiante_id !== undefined) estudianteData.estudiante_id = dto.estudiante_id;
            if (dto.deporte_id !== undefined) estudianteData.deporte_id = dto.deporte_id;

            // Actualizar estudiante (solo si hay datos para actualizar)
            let estudianteActualizado = estudiante;
            if (Object.keys(estudianteData).length > 0) {
                estudianteActualizado = await tx.estudiante.update({
                    where: { usuario_id: id },
                    data: estudianteData,
                });
            }

            return { usuario: usuarioActualizado, estudiante: estudianteActualizado };
        });
        // return this.prisma.$transaction( async (tx) => {
        //     // registro base de usuario
        //     const usuario = await tx.usuario.update({
        //         where: { id },
        //         data: {
        //             nombre: dto.nombre,
        //             email: dto.email,
        //             password_hash,
        //         },
        //     });
            
        //     const estudiante = await tx.estudiante.update({
        //         where: { usuario_id: id },
        //         data: {
        //             estudiante_id: dto.estudiante_id,
        //             deporte_id: dto.deporte_id,
        //         },
        //     });
            
        //     return { usuario, estudiante };
        // });
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

    async verCredencial(usuarioId: string) {
        // Buscamos el estudiante por usuario_id, incluyendo su deporte
        const estudiante = await this.prisma.estudiante.findUnique({
            where: { usuario_id: usuarioId },
            include: {
                usuario: {
                    select: { nombre: true, is_active: true },
                },
                deporte: {
                    select: { nombre: true },
                },
            },
        });

        if (!estudiante) {
            throw new NotFoundException('Credencial no encontrada');
        }

        return {
            nombre: estudiante.usuario.nombre,
            estudiante_id: estudiante.estudiante_id,
            deporte: estudiante.deporte?.nombre ?? 'Sin asignar',
            is_active: estudiante.usuario.is_active,
        };
    }
}