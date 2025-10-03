import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FindOneByIdProvider {
  constructor(private readonly prisma: PrismaService) {}
  public async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new UnauthorizedException('User dose not exists');
    }
    return user;
  }
}
