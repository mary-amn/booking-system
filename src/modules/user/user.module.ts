import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastraucture/persistence/user-orm.entity';
import { UserRepository } from './infrastraucture/repositories/user.repository';
import { UserController } from './interfave/rest/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [UserRepository /*, ... */],
  exports: [UserRepository],
  controllers:[UserController]
})
export class UserModule {}
