import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.token = crypto.randomBytes(32).toString('hex');
    return this.userRepository.store(createUserDto);
  }
}
