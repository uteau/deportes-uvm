import { Module } from '@nestjs/common';

// JwtModule es el módulo de NestJS que registra JwtService.
import { JwtModule } from '@nestjs/jwt';

// PassportModule registra el sistema de autenticación de Passport en NestJS.
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Registra Passport con la estrategia por defecto 'jwt'.
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Registra JwtModule con el secreto para firmar/verificar tokens.
    // El secreto viene de las variables de entorno.
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // No ponemos expiresIn aquí porque lo controlamos por rol en el service.
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // Registramos la strategy para que Passport la use
  ],
  exports: [
    JwtStrategy,    // Exportamos para que otros módulos puedan usar el guard
    PassportModule, // Exportamos para que otros módulos tengan acceso a Passport
  ],
})
export class AuthModule {}