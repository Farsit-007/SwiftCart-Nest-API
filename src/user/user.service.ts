import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { FindOneByIdProvider } from './providers/find-one-by-id.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly findOneUserByIdProvider: FindOneByIdProvider,
  ) {}

  public async createrUser(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserProvider.createrUser(createUserDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }

  public async findOneById(id: string) {
    return await this.findOneUserByIdProvider.findOneById(id);
  }
}
