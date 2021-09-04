import { Request } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { AuthConfig } from './config';
import { AuthUser } from './types';

export { checkToken, getEmailFromRequest, fetchAuthUser };

function getEmailFromRequest(config: AuthConfig, req: Request) {
  const emailField = config.audience + 'email';
  interface RequestWithUser extends Request {
    user: { [key: string]: string };
  }
  return (req as RequestWithUser).user[emailField];
}

async function fetchAuthUser(config: AuthConfig, req: Request) {
  const res = await fetch(`${config.domain}userinfo`, {
    headers: { Authorization: req.headers.authorization },
    method: 'get',
  });
  return (await res.json()) as AuthUser;
}

function checkToken(config: AuthConfig) {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${config.domain}.well-known/jwks.json`,
    }),

    audience: config.audience,
    issuer: config.domain,
    algorithms: ['RS256'],
  });
}
