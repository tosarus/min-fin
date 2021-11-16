import { NextFunction, Response, Request, RequestHandler } from 'express';
import { Inject, Service } from 'typedi';
import { Middleware } from '@tosarus/routing-express';
import { AuthConfig, tools } from '../../auth';
import { AUTH_CONFIG } from '../injectTokens';

@Service()
export class CheckToken implements Middleware {
  private handler_: RequestHandler;

  constructor(@Inject(AUTH_CONFIG) private config_: AuthConfig) {
    this.handler_ = tools.checkToken(this.config_);
  }

  public use(req: Request, res: Response, next: NextFunction) {
    this.handler_(req, res, (err?: any) => {
      if (err) {
        return next(err);
      }
      (req as any).email = tools.getEmailFromRequest(this.config_, req);
      next();
    });
  }
}
