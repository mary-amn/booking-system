import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingOrmEntity } from '../modules/booking/infrastraucture/persistence/booking-orm.entity';
import { UserOrmEntity } from '../modules/user/infrastraucture/persistence/user-orm.entity';
import { ResourceOrmEntity } from '../modules/resource/infrastraucture/persistence/resource-orm.entity';
import { BookingHistoryOrmEntity } from '../modules/booking/infrastraucture/persistence/booking-history-orm.entity';

@Global() // so you don't need to import it everywhere
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: cfg.get<number>('DB_PORT', 5432),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASS'),
        database: cfg.get<string>('DB_NAME'),
        autoLoadEntities: false,
        migrations: ['dist/migrations/*.js'],
        synchronize: false, // true only for quick demos, off in prod
        entities:[BookingOrmEntity, UserOrmEntity, ResourceOrmEntity,BookingHistoryOrmEntity],
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
