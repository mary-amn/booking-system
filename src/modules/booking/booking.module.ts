import { Module } from '@nestjs/common';
import { CreateBookingHandler } from './application/handlers/create-booking.handler';
import { ConfirmBookingHandler } from './application/handlers/confirm-booking.handler';
import { CancelBookingHandler } from './application/handlers/cancel-booking.handler';
import { GetBookingHandler } from './application/handlers/get-booking.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingOrmEntity } from './infrastraucture/persistence/booking-orm.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BookingRepository } from './infrastraucture/repositories/booking.repository';
const commandHandlers = [
  CreateBookingHandler,
  ConfirmBookingHandler,
  CancelBookingHandler,
];
const queryHandlers = [GetBookingHandler];
@Module({
  imports: [TypeOrmModule.forFeature([BookingOrmEntity]), CqrsModule],
  controllers: [],
  providers: [
    // infra
    BookingRepository,
    // CQRS
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class BookingModule {}
