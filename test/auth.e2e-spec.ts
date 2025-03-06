import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'tororo@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201)
      .then((response) => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      })
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'tontolo@gmail.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201);

    const cookie = response.headers['set-cookie'];
    expect(cookie).toBeDefined();

    const userResponse = await request(app.getHttpServer())
      .get('/auth/currentUser')
      .set('Cookie', cookie)
      .expect(200);

    const { email: userEmail } = userResponse.body;
    expect(userEmail).toEqual(email);
  });
});
