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
import { BookingHistoryRepository } from './infrastraucture/repositories/booking-history.repository';
import { BookingHistoryOrmEntity } from './infrastraucture/persistence/booking-history-orm.entity';
import { BookingHistoryHandler } from './application/events/handlers/booking-history.handler';
const commandHandlers = [
  CreateBookingHandler,
  ConfirmBookingHandler,
  CancelBookingHandler,
  BookingHistoryHandler
];

const queryHandlers = [GetBookingHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingOrmEntity, BookingHistoryOrmEntity]),
    CqrsModule,
  ],
  controllers: [BookingController],
  providers: [
    // infra
    BookingRepository,
    {
      provide: 'IBookingRepository', // Use a string token or the interface
      useClass: BookingRepository,
    },
    {
      provide: 'IBookingHistoryRepository', // Use a string token
      useClass: BookingHistoryRepository,
    },
    // CQRS
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: ['IBookingRepository','IBookingHistoryRepository'],
})
export class BookingModule {}
