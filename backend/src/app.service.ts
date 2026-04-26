import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Plataforma Deportiva UVM — API REST';
  }
}
