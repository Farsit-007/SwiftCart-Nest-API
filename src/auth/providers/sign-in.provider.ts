import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignDto } from '../dtos/sign.dto';
import { UserService } from 'src/user/user.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    // Send Confirmation
    return {
      accessToken,
    };
  }
}
