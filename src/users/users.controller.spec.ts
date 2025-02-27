import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'abedo@gmail.com', password: 'Abedi' } as User);
      },

      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'Abedi' } as User]);
      },

      // remove: () => { },
      // update: () => { },
    };

    fakeAuthService = {
      // // fake implement
      // signup: () => { },
      signIn: (email: string, password: string) => {
        // return a user with the given email and password
        return Promise.resolve({ id: 1, email, password } as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('FindsAllUsers returns a list of users with same email', async () => {
    const users = await controller.findAllUsers('abedo@gmail.com') as User[];
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('abedo@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('findUser throws an error if user with given id is not found', async () => {
    try {
      await controller.findUser('1');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toEqual('user not found');
    }
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin({ email: 'lukaku@gmail.com', password: 'lukaku' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
