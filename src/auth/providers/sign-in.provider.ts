import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignDto } from '../dtos/sign.dto';
import { UserService } from 'src/user/user.service';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signIn(signInDto: SignDto) {
    // Find the user using email ID
    const user = await this.userService.findOneByEmail(signInDto.email);
    // Throw an exception user not found
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // Compare password to the hash
    const isPasswordMatched = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // Send Confirmation
    return true;
  }
}
