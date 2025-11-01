import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { FindOneByIdProvider } from './providers/find-one-by-id.provider';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseQueryDto } from 'src/common/queryBuilder/dtos/base-query.dto';
import { PrismaQueryBuilder } from 'src/common/queryBuilder/dtos/prisma-query-builder';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly findOneUserByIdProvider: FindOneByIdProvider,
    private readonly prisma: PrismaService,
  ) {}

  public async createrUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.createUserProvider.createrUser(createUserDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }

  public async findOneById(id: string) {
    return await this.findOneUserByIdProvider.findOneById(id);
  }

  public async findAllUsers(query: BaseQueryDto) {
    const searchFields = ['name', 'email'];

    const builder = new PrismaQueryBuilder({ ...query, searchFields })
      .search()
      .filter()
      .sort()
      .paginate();

    const prismaQuery = builder.build();

    const data = await this.prisma.user.findMany(prismaQuery);
    const meta = await builder.countTotal(this.prisma.user);

    return { data, meta };
  }
}
