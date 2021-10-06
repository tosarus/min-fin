import { Request, Response } from 'express';
import { Injectable } from '@decorators/di';
import { ErrorMiddleware } from '@decorators/express';

@Injectable()
export class ApiErrorMiddleware implements ErrorMiddleware {
  public use(error: Error, _: Request, res: Response) {
    res.status(400).send(error);
  }
}
