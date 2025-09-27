import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ClientInfoDto {
  @IsEnum(['pc', 'mobile'])
  device: 'pc' | 'mobile';

  @IsString()
  browser: string;

  @IsString()
  ipAddress: string;

  @IsString()
  @IsOptional()
  pcName?: string;

  @IsString()
  @IsOptional()
  os?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;
}
