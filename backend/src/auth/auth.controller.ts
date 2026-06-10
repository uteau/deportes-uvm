import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST /api/auth/login
    // @HttpCode(200) evita que NestJS devuelva 201 (su default para POST).
    // El login no crea un recurso nuevo, por eso usamos 200.
    @Post('login')
    @HttpCode(200)
    login(@Body() dto: LoginDto) {
        // @Body() extrae el body de la request y lo mapea al DTO.
        // NestJS valida automáticamente el DTO antes de llegar aquí.
        return this.authService.login(dto);
    }

    // POST /api/auth/logout
    @Post('logout')
    @HttpCode(200)
    logout() {
        // No necesita body ni token. El cliente ya eliminó el token localmente.
        return this.authService.logout();
    }
}