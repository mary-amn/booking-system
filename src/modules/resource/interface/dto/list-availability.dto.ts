// src/modules/scheduling/interfaces/rest/dto/list-availability.dto.ts
import { IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListAvailabilityDto {
  @ApiProperty({ description: 'Resource ID to check' })
  @IsUUID()
  resourceId!: string;

  @ApiProperty({ description: 'Availability window start (ISO 8601 UTC)' })
  @IsDateString()
  from!: string;

  @ApiProperty({ description: 'Availability window end (ISO 8601 UTC)' })
  @IsDateString()
  to!: string;
}
