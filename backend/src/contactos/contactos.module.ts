import { Module } from '@nestjs/common';
import { ContactosAdminController, ContactosController } from './contactos.controller';
import { ContactosService } from './contactos.service';

@Module({
    controllers: [ContactosController, ContactosAdminController],
    providers: [ContactosService],
    exports: [ContactosService],
})
export class ContactosModule {}