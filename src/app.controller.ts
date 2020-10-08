import { Controller, Get } from '@nestjs/common';
import { App1Service } from './app.service';

@Controller('/test')
export class App1Controller {
  constructor(private readonly appService: App1Service) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
