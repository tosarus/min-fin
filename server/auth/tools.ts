import axios from 'axios';
import { expressjwt, GetVerificationKey, Request } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { AuthConfig } from './config';
import { AuthUser } from './types';

export const getEmailFromRequest = (config: AuthConfig, req: Request) => {
  const emailField = config.audience + 'email';
  return req.auth![emailField];
};

export const fetchAuthUser = async (config: AuthConfig, req: Request) => {
  const res = await axios.get<AuthUser>(`${config.domain}userinfo`, {
    headers: { Authorization: req.headers.authorization || '' },
  });
  return res.data;
};

export const checkToken = (config: AuthConfig) => {
  return expressjwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${config.domain}.well-known/jwks.json`,
    }) as unknown as GetVerificationKey,

    audience: config.audience,
    issuer: config.domain,
    algorithms: ['RS256'],
  });
};
