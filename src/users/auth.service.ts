import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async signUp(email: string, password: string) {
    // see if the email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash the user's password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashedPassword = salt + '.' + hash.toString('hex')

    // Create a new user and save it
    const user = await this.usersService.create(email, hashedPassword);

    // Return the user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // compare stored password with password from body
    const [salt, storedHashedPassword] = user.password.split('.');
    const hashedPasswordFromBody = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHashedPassword !== hashedPasswordFromBody.toString('hex')) {
      throw new BadRequestException('bad password')
    }

    return user;
  }
}
