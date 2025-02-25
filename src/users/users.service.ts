import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // inject the user repository in the service (dependency injection)
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  // create a new user
  create(email: string, password: string) {
    // create a new user
    const user = this.repo.create({ email, password });
    // save the user to the database
    return this.repo.save(user);
  }
}
