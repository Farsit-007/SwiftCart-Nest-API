import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
