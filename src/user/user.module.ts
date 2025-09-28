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
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientInfoMiddleware)
      .forRoutes({ path: 'users/register', method: RequestMethod.POST });
  }
}
