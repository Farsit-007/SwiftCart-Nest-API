import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException('User dose not exists');
    }
    return user;
  }
}
