import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";


export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // get the request object from the context
    const request = context.switchToHttp().getRequest();
    // return true if the session object exists
    return request.session.userId;
  }
}
