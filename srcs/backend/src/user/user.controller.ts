import { UserOutput } from './dtos/user.dto';
import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/auth/authUser.decorator';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'returns my info',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/me')
  getMe(@AuthUser() user: User): UserOutput {
    if (user) {
      return { ok: true, user };
    }
    return { ok: false };
  }
}
