import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: false,
      entities: ['dist/**/*.entity.{ts,js}'],
    }),
    UserModule,
    AuthModule,
    LoginModule.forRoot({
      baseUrl: process.env.NESTJS_42API_BASE,
      uid: process.env.NESTJS_UID,
      secret: process.env.NESTJS_SECRET,
      redirect: `http://localhost:${process.env.NESTJS_PORT}/login/redirect`,
    }),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
