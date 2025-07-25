// src/modules/scheduling/interfaces/rest/dto/update-resource.dto.ts
import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateResourceDto {
  @ApiPropertyOptional({ description: 'New name for the resource' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'New capacity (>=1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'New timezone (IANA string)',
    example: 'Europe/Amsterdam',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
