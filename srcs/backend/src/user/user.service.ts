import {
  CheckNickNameOutput,
  CreateUserOutput,
  getMeOutput,
  getUserByNickNameOutput,
  UpdateUserDto,
  UpdateUserOutput,
} from './dtos/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async getMe(intra: string): Promise<getMeOutput> {
    try {
      const user = await this.users.findOne({
        where: { intra },
      });
      if (user) {
        return { ok: true, user };
      }
      return { ok: false, error: 'User not Found' };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async createUser(
    intra: string,
    usual_full_name: string,
  ): Promise<CreateUserOutput> {
    try {
      const exists = await this.users.findOne({
        where: { intra },
      });
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with that intraID already',
        };
      }
      const user = await this.users.save(
        this.users.create({ intra, usual_full_name }),
      );
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }
  async getUserByNickName(nickname: string): Promise<getUserByNickNameOutput> {
    try {
      const user = await this.users.findOne({
        where: { nickname },
      });
      if (user) {
        return {
          ok: false,
          user,
        };
      }
      return { ok: false, error: 'Cannot find User.' };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async checkNickName(nickname: string): Promise<CheckNickNameOutput> {
    try {
      const exists = await this.users.findOne({
        where: { nickname },
      });
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with that nickname already',
        };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async updateUser(
    userId: number,
    updateData: UpdateUserDto,
  ): Promise<UpdateUserOutput> {
    try {
      this.users.update(userId, { ...updateData });
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
