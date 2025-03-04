import { ValidationPipe } from "@nestjs/common";
import cookieSession from "cookie-session";

export const setApp = (app: any) => {
  app.use(cookieSession({
    //
    keys: ['asdfasdf']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

}
