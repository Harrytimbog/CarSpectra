import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => {

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;


  beforeEach(async () => {
    // Create a test copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signUp('labalab@gmail.com', 'lalalala')).rejects.toThrow(BadRequestException);
  });

  // Add test to ensure that signin works
  it('throws if signin is called with an unused email', async () => {
    // find the user and ensure that the user is not found
    fakeUsersService.find = () => Promise.resolve([]);
    await expect(service.signIn('labala@gmail.com', 'lalalala')).rejects.toThrow(NotFoundException);
  });
});

