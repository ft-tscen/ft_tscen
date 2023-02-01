import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { loginModuleOptions } from './login.interfaces';
import { LoginService } from './login.service';

@Module({})
@Global()
export class LoginModule {
  static forRoot(options: loginModuleOptions): DynamicModule {
    return {
      module: LoginModule,
      exports: [LoginService],
      controllers: [LoginController],
      providers: [
        { provide: 'login_options', useValue: options },
        LoginService,
      ],
    };
  }
}
