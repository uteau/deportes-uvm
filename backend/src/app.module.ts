import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventosModule } from './eventos/eventos.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventosModule,
  ],
})
export class AppModule {}