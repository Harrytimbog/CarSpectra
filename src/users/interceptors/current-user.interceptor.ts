import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";

import { UsersService } from "../users.service"

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) { }

  async intercept(context: ExecutionContext, handler: CallHandler) {
    // get the request object from the context
    const request = context.switchToHttp().getRequest();
    // Get the userId from the session object
    const { userId } = request.session || {};
    if (userId) {
      // find the user by id
      const user = await this.usersService.findOne(userId);
      // attach the user to the request object
      request.currentUser = user;
    }
    // return the handler
    return handler.handle();
  }
}
