import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../infrastraucture/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { Email } from '../../domain/value-object/email.vo';

@Controller('users')
export class UserController {
  constructor(private readonly repo: UserRepository) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const email = Email.create(dto.email);
    const user = User.create(dto.email, email.value);
    await this.repo.save(user);
    return { id: user.id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.repo.findById(Number(id));
  }
}
