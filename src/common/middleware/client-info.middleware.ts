/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Above lines disable ESLint rules to avoid errors when working with `ua-parser-js`
// because it may return `any` type data.

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';

// Define a TypeScript interface for structured client information
export interface ClientInfo {
  device: 'pc' | 'mobile'; // Either PC or mobile
  browser: string; // e.g., Chrome, Firefox, Safari
  ipAddress: string; // Client IP address
  pcName?: string; // Optional: hostname (from request header)
  os?: string; // Operating system (Windows, macOS, etc.)
  userAgent: string; // Full raw User-Agent string
}

@Injectable() // Marks this as an injectable class that can be used by NestJS
export class ClientInfoMiddleware implements NestMiddleware {
  // Middleware must implement the `use` method
  use(req: Request, res: Response, next: NextFunction) {
    // Extract user-agent string from request headers
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Parse the User-Agent using UAParser
    const parser = new UAParser(userAgent);
    const parsedUA = parser.getResult();

    // Attach client info to request body for later use in controllers/services
    req.body.clientInfo = {
      device: (parsedUA.device.type as 'pc' | 'mobile') || 'pc', // Default to 'pc'
      browser: parsedUA.browser.name || 'Unknown', // Browser name (fallback: Unknown)
      ipAddress:
        (req.headers['x-forwarded-for'] as string) || // If request is behind a proxy
        req.socket.remoteAddress || // Fallback: direct socket IP
        'Unknown',
      pcName: req.headers['host'] as string, // Hostname of client
      os: parsedUA.os.name || 'Unknown', // Extract OS name
      userAgent: userAgent, // Raw user-agent string
    };

    // Pass control to the next middleware/controller
    next();
  }
}
