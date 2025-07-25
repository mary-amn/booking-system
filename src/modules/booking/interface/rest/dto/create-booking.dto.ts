import { IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID of the user making the booking' })
  @IsNumber()
  userId: string;

  @ApiProperty({ description: 'ID of the resource to book' })
  @IsNumber()
  resourceId: string;

  @ApiProperty({ description: 'Booking start time (ISO 8601 UTC)' })
  @IsDateString()
  startsAt: string;

  @ApiProperty({ description: 'Booking end time (ISO 8601 UTC)' })
  @IsDateString()
  endsAt: string;
}
