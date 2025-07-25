// src/modules/scheduling/interfaces/rest/dto/create-resource.dto.ts
import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ description: 'Human‐readable name of the resource' })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'How many concurrent bookings allowed',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiProperty({
    description: 'IANA timezone of the resource (e.g. Europe/Amsterdam)',
    example: 'UTC',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
