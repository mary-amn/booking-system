import { Module } from '@nestjs/common';
import { BookingModule } from './modules/booking/booking.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { ResourceModule } from './modules/resource/resource.module';

@Module({
  imports: [BookingModule, DatabaseModule, ResourceModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
