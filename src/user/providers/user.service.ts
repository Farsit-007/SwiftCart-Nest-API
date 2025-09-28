import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserProvider } from './create-user.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  public async createrUser(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserProvider.createrUser(createUserDto);
  }
}
