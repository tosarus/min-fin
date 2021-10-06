import { NextFunction, Request, Response } from 'express';
import { Middleware } from '@decorators/express';
import { WorkbookDao } from '../../database';

export class ValidateWorkbook implements Middleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const email = (req as any).email;
    WorkbookDao.getById(email, +req.params.workbookId)
      .then(() => next())
      .catch(next);
  }
}
