import { Module } from "@nestjs/common";
import { PartidosAdminController, PartidosController } from "./partidos.controller";
import { PartidosService } from "./partidos.service";


@Module({
    controllers: [PartidosController, PartidosAdminController],
    providers: [PartidosService],
    exports: [PartidosService],
})
export class PartidosModule {}