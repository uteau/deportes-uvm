import { Module } from "@nestjs/common";
import { AnunciosAdminController, 
    AnunciosPublicosController, 
    AnunciosSeluvmController } from "./anuncios.controller";
import { AnunciosService } from "./anuncios.service";

@Module({
    controllers: [
        AnunciosAdminController,
         AnunciosPublicosController,
        AnunciosSeluvmController
    ],
    providers: [AnunciosService],
    exports: [AnunciosService]
})
export class AnunciosModule {}