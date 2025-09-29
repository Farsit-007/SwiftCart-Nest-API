import { Injectable } from '@nestjs/common';
import { SignDto } from './dtos/sign.dto';
import { SignInProvider } from './providers/sign-in.provider';

@Injectable()
export class AuthService {
  constructor(private readonly signInProvider: SignInProvider) {}

  public async signIn(signInDto: SignDto) {
    return await this.signInProvider.signIn(signInDto);
  }
}
