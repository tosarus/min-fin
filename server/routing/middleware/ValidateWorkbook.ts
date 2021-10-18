import { NextFunction, Request, Response } from 'express';
import { Inject } from '@decorators/di';
import { Middleware } from '@decorators/express';
import { WorkbooksService } from '../../services';

export class ValidateWorkbook implements Middleware {
  constructor(@Inject(WorkbooksService) private repository_: WorkbooksService) {}

  public use(req: Request, res: Response, next: NextFunction) {
    const email = (req as any).email;
    this.repository_
      .getById(email, req.params.workbookId)
      .then(() => next())
      .catch(next);
  }
}
