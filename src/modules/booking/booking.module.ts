import { Module } from '@nestjs/common';
import { CreateBookingHandler } from './application/handlers/create-booking.handler';
import { ConfirmBookingHandler } from './application/handlers/confirm-booking.handler';
import { CancelBookingHandler } from './application/handlers/cancel-booking.handler';
import { GetBookingHandler } from './application/handlers/get-booking.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingOrmEntity } from './infrastraucture/persistence/booking-orm.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BookingRepository } from './infrastraucture/repositories/booking.repository';
import { BookingController } from './interface/rest/booking.controller';
import { ListAvailabilityHandler } from './application/handlers/list-availability.handler';
const commandHandlers = [
  CreateBookingHandler,
  ConfirmBookingHandler,
  CancelBookingHandler,
];


const queryHandlers = [GetBookingHandler,ListAvailabilityHandler];

const bookingRepositoryProvider = {
  provide: 'IBookingRepository', // Use a string token or the interface
  useClass: BookingRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([BookingOrmEntity]), CqrsModule],
  controllers: [BookingController],
  providers: [
    // infra
    BookingRepository,
    {
      provide: 'IBookingRepository', // Use a string token or the interface
      useClass: BookingRepository,
    },
    // CQRS
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports:['IBookingRepository']
})
export class BookingModule {}
