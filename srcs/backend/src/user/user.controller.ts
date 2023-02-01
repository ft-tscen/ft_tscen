import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/auth/authUser.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  checkLogin(@AuthUser() user: User) {
    if (user) {
      return { login: true, user };
    }
    return { login: false };
  }
}
