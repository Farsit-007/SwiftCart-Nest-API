/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { UserRole } from '@prisma/client';

import jwtConfig from 'src/auth/config/jwt.config';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { UserService } from 'src/user/user.service';

export interface IRequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: IRequestWithUser = context.switchToHttp().getRequest();

    // get roles metadata from decorator
    const requiredRoles =
      this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler()) || [];

    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    let decoded: any;

    try {
      // verify token using JwtService
      decoded = this.jwtService.verify(token as string, {
        secret: this.jwtConfiguration.secret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // fetch user from database
    const user = await this.userService.findOneById(decoded.id);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isActive) throw new ForbiddenException('Your account is blocked');

    // check if password was changed after token issued
    if (
      user.passwordChangedAt &&
      user.passwordChangedAt.getTime() / 1000 > decoded.iat
    ) {
      throw new UnauthorizedException(
        'Password changed after token was issued',
      );
    }

    // role check
    if (
      requiredRoles.length &&
      !requiredRoles.includes(user.role as UserRole)
    ) {
      throw new ForbiddenException('You do not have permission');
    }

    req.user = user; // attach full user object to request
    return true;
  }
}
