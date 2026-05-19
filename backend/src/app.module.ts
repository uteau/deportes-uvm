import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventosModule } from './eventos/eventos.module';
import { PartidosModule } from './partidos/partidos.module';
import { AnunciosModule } from './anuncios/anuncios.module';
import { FeedModule } from './feed/feed.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DeportesModule } from './deportes/deportes.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventosModule,
    PartidosModule,
    AnunciosModule,
    FeedModule,
    UsuariosModule,
    DeportesModule,
  ],
})
export class AppModule {}