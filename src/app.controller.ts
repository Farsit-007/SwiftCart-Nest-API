import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request) {
    const response = this.appService.getHello();

    const clientIp =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    response.clientDetails.ipAddress = clientIp ?? '';

    return response;
  }
}
