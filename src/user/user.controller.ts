import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator.ts/response-message.decorator.ts.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/auth/roles.guard';
import { BaseQueryDto } from 'src/common/queryBuilder/dtos/base-query.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseGuards(RolesGuard)
  @Auth(AuthType.None)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('User registered successfully!')
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createrUser(createUserDto);
  }

  @Get('all-users')
  @Auth(AuthType.None)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Users retriveted successfully')
  public getAllUser(@Query() query: BaseQueryDto) {
    return this.userService.findAllUsers(query);
  }
}
