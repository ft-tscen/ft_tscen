import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.NESTJS_SESSION_ID, //세션아이디
      resave: false, //세션이 수정되지 않아도 지속적으로 저장하게 하는 옵션
      saveUninitialized: false, //초기화되지 않는 세션을 저장하게 함
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('login')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({ origin: `http://localhost:3000`, credentials: true });
  await app.listen(parseInt(process.env.NESTJS_PORT) || 3001);
}
bootstrap();
