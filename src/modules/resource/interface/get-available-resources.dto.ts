import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class GetAvailableResourcesDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Start time in ISO format' })
  startTime: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'End time in ISO format' })
  endTime: string;
}