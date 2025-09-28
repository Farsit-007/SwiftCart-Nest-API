import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './providers/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientInfoMiddleware } from 'src/common/middleware/client-info.middleware';

@Module({
  imports: [PrismaModule], // Import Prisma so UserService can use database
  controllers: [UserController], // Register UserController to handle routes
  providers: [UserService], // Register UserService as a provider
})
export class UserModule implements NestModule {
  // UserModule implements NestModule so we can configure middleware inside it.
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientInfoMiddleware) // Apply the ClientInfoMiddleware
      .forRoutes({
        path: 'users/register', // Target only the route POST /users/register
        method: RequestMethod.POST, // Middleware applies ONLY for POST requests
      });
  }
}
