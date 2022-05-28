import axios from 'axios';
import { Request } from 'express';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { AuthConfig } from './config';
import { AuthUser } from './types';

export { checkToken, getEmailFromRequest, fetchAuthUser };

function getEmailFromRequest(config: AuthConfig, req: Request) {
  const emailField = config.audience + 'email';
  interface RequestWithAuth extends Request {
    auth: { [key: string]: string };
  }
  return (req as RequestWithAuth).auth[emailField];
}

async function fetchAuthUser(config: AuthConfig, req: Request) {
  const res = await axios.get<AuthUser>(`${config.domain}userinfo`, {
    headers: { Authorization: req.headers.authorization || '' },
  });
  return res.data;
}

function checkToken(config: AuthConfig) {
  return expressjwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${config.domain}.well-known/jwks.json`,
    }) as GetVerificationKey,

    audience: config.audience,
    issuer: config.domain,
    algorithms: ['RS256'],
  });
}
