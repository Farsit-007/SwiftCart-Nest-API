import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createrUser(createUserDto);
  }
}
