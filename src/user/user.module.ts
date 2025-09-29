import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './providers/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientInfoMiddleware } from 'src/common/middleware/client-info.middleware';
import { CreateUserProvider } from './providers/create-user.provider';
import { AuthModule } from 'src/auth/auth.module';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)], // Import Prisma so UserService can use database
  controllers: [UserController], // Register UserController to handle routes
  providers: [UserService, CreateUserProvider, FindOneUserByEmailProvider], // Register UserService as a provider
  exports: [UserService],
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
