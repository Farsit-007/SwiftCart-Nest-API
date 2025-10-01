import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createrUser(createUserDto);
  }
}
