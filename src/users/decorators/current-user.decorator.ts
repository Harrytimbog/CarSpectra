import { from } from "rxjs";
import {
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  // data is the value passed to the decorator
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    return request.currentUser;
  }
)
