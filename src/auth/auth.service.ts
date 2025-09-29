import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignDto } from './dtos/sign.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public signIn(signInDto: SignDto) {
    // Find the user using email ID
    // Throw an exception user not found
    // Compare password to the hash
    // Send Confirmation
  }
}
