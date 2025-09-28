import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async createrUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new BadRequestException('This user already exists');
    }
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await this.hashingProvider.hashingPassword(
          createUserDto.password,
        ),
      },
    });
  }
}
