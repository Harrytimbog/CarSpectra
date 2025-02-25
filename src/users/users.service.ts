import { Injectable, NotFoundException } from '@nestjs/common';
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

  // find a user by id
  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('user not found');
      return null;
    }
    return this.repo.findOneBy({ id });
  }
  // find a user by email
  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  // update a user
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // update the user with the new attributes
    Object.assign(user, attrs);
    // save the user to the database ( replace the old values with the new ones from attrs)
    return this.repo.save(user);
  }

  // delete a user
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // remove the user from the database
    return this.repo.remove(user);
  }

}
