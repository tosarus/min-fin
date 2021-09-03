import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { AuthConfig } from './config';

const checkJwt = (config: AuthConfig) =>
  jwt({
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

export default checkJwt;
