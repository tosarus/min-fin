import { Request } from 'express';
import { AuthConfig } from './config';

const getUserIdFromReq = (config: AuthConfig, req: Request) => {
  const userIdField = config.audience + 'email';
  interface RequestWithUser extends Request {
    user: { [key: string]: string };
  }
  return (req as RequestWithUser).user[userIdField];
};

export { getUserIdFromReq };
