import { Module } from '@nestjs/common';
import { EstudianteController, UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  controllers: [UsuariosController, EstudianteController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}