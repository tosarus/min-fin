import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { Middleware } from '@shared/routing-controllers';
import { WorkbooksService } from '../../services';

@Service()
export class ValidateWorkbook implements Middleware {
  constructor(private repository_: WorkbooksService) {}

  public use(req: Request, res: Response, next: NextFunction) {
    const email = (req as any).email;
    this.repository_
      .getById(email, req.params.workbookId)
      .then(() => next())
      .catch(next);
  }
}
