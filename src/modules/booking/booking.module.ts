import { Module } from '@nestjs/common';
import { RestController } from './interfaces/rest.controller';

@Module({
  controllers: [RestController]
})
export class BookingModule {}
