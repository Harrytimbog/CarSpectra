import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { User } from './users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import cookieSession from 'cookie-session';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Report],
    synchronize: true,
  }),
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
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(cookieSession
    consumer.apply(cookieSession({
      keys: ['asdfasdf']
    }),
    ).forRoutes('*');
  }
}
