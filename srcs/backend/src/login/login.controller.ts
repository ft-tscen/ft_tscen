import { Controller, Get, Query, Redirect, Session } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  @Redirect(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`)
  checkLogin(@Session() session: Record<string, any>) {
    if (!session.login) {
      return {
        url: this.loginService.getOAuthUrl(),
      };
    }
  }

  @Get('/redirect')
  @Redirect(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`)
  async login(
    @Session() session: Record<string, any>,
    @Query('code') code: string,
  ) {
    const { ok, error } = await this.loginService.login(session, code);
    if (!ok) {
      return { ok, error };
    }
  }
}
