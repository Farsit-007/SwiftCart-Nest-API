import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { GenerateTokenProvider } from './generate-token.provider';
import { UserService } from 'src/user/user.service';
import { ActiveUserInterface } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly generateTokensProvider: GenerateTokenProvider,
    private readonly usersService: UserService,
  ) {}

  public async refreshtokens(refreshTokenDto: RefreshTokenDto) {
    // Verify the refrsh token using jwtService
    const { id } = await this.jwtService.verifyAsync<
      Pick<ActiveUserInterface, 'id'>
    >(refreshTokenDto.refreshToken, {
      secret: this.jwtConfiguration.secret,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
    });
    // Fetch the user from the databse
    const user = await this.usersService.findOneById(id);
    // Generate the tokens
    return await this.generateTokensProvider.generateTokens(user);
  }
}
