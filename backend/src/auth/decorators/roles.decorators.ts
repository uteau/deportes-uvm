import { SetMetadata } from '@nestjs/common';

// 'roles' es la clave con la que guardamos la metadata
// @Roles('admin') adjunta el string 'admin' al controlador o método
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);