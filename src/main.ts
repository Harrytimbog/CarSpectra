import { APP_FILTER, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setApp } from './setup-app';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setApp(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
