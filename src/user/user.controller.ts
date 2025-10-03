import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator.ts/response-message.decorator.ts.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Auth(AuthType.None)
  @ResponseMessage('User registered successfully!')
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createrUser(createUserDto);
  }
}
