import { Controller, Get, Query, Redirect, Session } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Get()
  @Redirect('/user/me')
  checkLogin(@Session() session: Record<string, any>) {
    if (!session.login) {
      return {
        url: this.loginService.getOAuthUrl(),
      };
    }
  }

  @Get('/redirect')
  async login(
    @Session() session: Record<string, any>,
    @Query('code') code: string,
  ) {
    return await this.loginService.login(session, code);
  }
}
