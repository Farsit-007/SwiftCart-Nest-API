import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // Register PrismaService as a provider inside this module
  exports: [PrismaService], // Export the Services so other modules can use it
})
export class PrismaModule {}
