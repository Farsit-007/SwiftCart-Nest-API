/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/common/middleware/client-info.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';

export interface ClientInfo {
  device: 'pc' | 'mobile';
  browser: string;
  ipAddress: string;
  pcName?: string;
  os?: string;
  userAgent: string;
}

@Injectable()
export class ClientInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const parser = new UAParser(userAgent);
    const parsedUA = parser.getResult();

    req.body.clientInfo = {
      device: (parsedUA.device.type as 'pc' | 'mobile') || 'pc',
      browser: parsedUA.browser.name || 'Unknown',
      ipAddress:
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        'Unknown',
      pcName: req.headers['host'] as string,
      os: parsedUA.os.name || 'Unknown',
      userAgent: userAgent,
    };

    next();
  }
}
