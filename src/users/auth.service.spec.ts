import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {

  let service: AuthService;

  beforeEach(async () => {
    // Create a test copy of the users service
    const fakeUsersService: Partial<UsersService> = {
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

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

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
});

