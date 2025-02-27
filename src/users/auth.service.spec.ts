import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => {

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;


  beforeEach(async () => {
    // Create a test copy of the users servic
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 9999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };


    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // Add a test to ensure that the auth service is defined
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  // Add test to ensure that passwords are salted and hashed
  it('creates a new user with a salted and hashed password', async () => {
    // Create a test copy of the users service
    const user = await service.signUp('abedo@gmail.com', 'lalalala');
    // Check that the user's password is not equal to the original password
    expect(user.password).not.toEqual('lalalala');

    const [salt, hash] = user.password.split('.');
    // Check that the user's password is salted and hashed
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // Add test to ensure that signup email is unique
  it('throws error if user signs up with email that is in use', async () => {
    // Create a test copy of the users service
    await service.signUp('labalab@gmail.com', 'lalalala');
    await expect(service.signUp('labalab@gmail.com', 'lalalala')).rejects.toThrow(BadRequestException);
  });

  // Add test to ensure that signin works
  it('throws if signin is called with an unused email', async () => {
    // find the user and ensure that the user is not found
    await expect(service.signIn('labala@gmail.com', 'lalalala')).rejects.toThrow(NotFoundException);
  });


  it('throws if an invalid password is provided', async () => {
    await service.signUp('gute@gmail.com', 'ganusi');

    await expect(service.signIn('gute@gmail.com', 'gute')).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('ade@gmail.com', '123456');
    const user = await service.signIn('ade@gmail.com', '123456');
    expect(user).toBeDefined();
  });
});

