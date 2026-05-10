import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventosModule } from './eventos/eventos.module';
import { PartidosModule } from './partidos/partidos.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventosModule,
    PartidosModule,
  ],
})
export class AppModule {}