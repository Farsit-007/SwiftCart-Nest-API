import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppService {
  getHello() {
    const currentDateTime = new Date().toISOString();
    const clientIp = '';
    const serverHostname = os.hostname();
    const serverPlatform = os.platform();
    const serverUptime = os.uptime();

    return {
      success: true,
      message: 'Welcome to Swiftcart apis',
      version: '1.0',
      clientDetails: {
        ipAddress: clientIp,
        accessedAt: currentDateTime,
      },
      serverDetails: {
        hostname: serverHostname,
        platform: serverPlatform,
        uptime: `${Math.floor(serverUptime / 60 / 60)} hours ${Math.floor(
          (serverUptime / 60) % 60,
        )} minutes`,
      },
      developerContact: {
        email: ['robayatfarsit@gmail.com', 'rajib5570@gmail.com'],
      },
    };
  }
}
