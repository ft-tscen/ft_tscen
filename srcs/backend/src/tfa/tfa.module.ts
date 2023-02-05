import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, DynamicModule } from '@nestjs/common';
import { TfaController } from './tfa.controller';
import { TfaService } from './tfa.service';
import { tfaModuleOptions } from './tfa.interfaces';

@Module({})
export class TfaModule {
  static forRoot(options: tfaModuleOptions): DynamicModule {
    return {
      module: TfaModule,
      imports: [TypeOrmModule.forFeature([User])],
      controllers: [TfaController],
      providers: [
        { provide: 'tfa_options', useValue: options },
        TfaService,
        UserService,
      ],
    };
  }
}
