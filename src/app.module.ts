import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { User } from './users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        }
      },
    }),
    //   TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    ReportsModule,
    UsersModule],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // This is a global pipe that will be applied to all routes even e2e tests
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})

export class AppModule {
  // This is a middleware that will be applied to all routes
  constructor(private configService: ConfigService) { }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(cookieSession
    consumer.apply(cookieSession({
      keys: [this.configService.get<string>('COOKIE_KEY')],
    }),
    ).forRoutes('*');
  }
}
