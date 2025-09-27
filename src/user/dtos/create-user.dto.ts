/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ClientInfoDto } from './client-info.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'This is a valid email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '*****',
    description: 'Five digit password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiPropertyOptional({
    example: 'This is optional as a date',
    description: 'This is optional as a date, store when the password changed',
  })
  @IsDate()
  @IsOptional()
  passwordChangedAt?: Date;

  @ApiProperty({
    example: 'John Doe',
    description: 'This a name field',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'PhotoUrl',
    description: 'This is a photo url field and optional',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  profilePhoto?: string;

  @ApiPropertyOptional({
    example: UserRole,
    description: "Possible value : 'USER', 'ADMIN'",
  })
  @IsEnum(UserRole)
  role: UserRole = 'USER';

  @ApiProperty({
    example: 'Default value "false"',
    description: 'This a flag for shop avalability',
  })
  @IsBoolean()
  hasShop: boolean = false;

  @ApiProperty({
    type: () => ClientInfoDto,
    description: 'This is the login user info',
    example: {
      clientInfo: {
        type: 'json',
        description: 'The clientInfo can be json string',
      },
    },
  })
  @ValidateNested()
  @Type(() => ClientInfoDto)
  clientInfo: Record<string, any>;

  @ApiPropertyOptional({
    example: 'Default Date',
    description: 'This a default date when its logged in',
  })
  @IsDate()
  lastLogin: Date = new Date();

  @ApiPropertyOptional({
    example: 'Default value "True"',
    description: 'This a default value for user avalability',
  })
  @IsBoolean()
  isActive: boolean = true;

  @ApiPropertyOptional({
    example: 'otpToken',
    description: 'otpToken',
  })
  @IsString()
  @IsOptional()
  otpToken?: string;
}
