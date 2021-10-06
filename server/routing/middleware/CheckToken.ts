import { NextFunction, Response, Request, RequestHandler } from 'express';
import { Middleware } from '@decorators/express';
import { Inject } from '@decorators/di';
import { AUTH_CONFIG } from '../injectTokens';
import { AuthConfig, tools } from '../../auth';

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
