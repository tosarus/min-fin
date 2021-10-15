import { NextFunction, Request, Response } from 'express';
import { Inject } from '@decorators/di';
import { Middleware } from '@decorators/express';
import { WorkbookRepository } from '../../database';

export class ValidateWorkbook implements Middleware {
  constructor(@Inject(WorkbookRepository) private repository_: WorkbookRepository) {}

  public use(req: Request, res: Response, next: NextFunction) {
    const email = (req as any).email;
    this.repository_
      .getById(email, req.params.workbookId)
      .then(() => next())
      .catch(next);
  }
}
