import { Module } from "@nestjs/common";
import { EventosAdminController, EventosPublicosController } from "./eventos.controller";
import { EventosService } from "./eventos.service";


@Module({
    controllers: [EventosPublicosController, EventosAdminController],
    providers: [EventosService],
    // Exportamos el servicio por si otro módulo lo necesita (ej: el FeedModule)
    exports: [EventosService],
})
export class EventosModule {}