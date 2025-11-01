// src/common/dto/base-query.dto.ts
import { IsOptional, IsString, IsInt, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseQueryDto {
  @IsOptional()
  @IsString()
  searchTerm?: string; // text search across multiple fields

  @IsOptional()
  @IsString()
  sort?: string; // e.g., '-createdAt' or 'name'

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1; // default page 1

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 10; // default limit 10

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  min?: number; // numeric range min

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  max?: number; // numeric range max

  @IsOptional()
  @IsString()
  numericField?: string; // numeric field name for min/max

  @IsOptional()
  @IsObject()
  filter?: Record<string, any>; // dynamic filters
}
