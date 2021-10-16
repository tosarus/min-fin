import { Response, Request } from 'express';
import { Inject } from '@decorators/di';
import { Body, Controller, Delete, Get, Params, Post, Response as Res, Request as Req } from '@decorators/express';
import { Workbook } from '@shared/types';
import { WorkbooksService } from '../../services';
import { CheckToken } from '../middleware';

@Controller('/workbooks', [CheckToken])
export class WorkbooksController {
  constructor(@Inject(WorkbooksService) private workbooks_: WorkbooksService) {}

  @Get('')
  async getWorkbooks(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(await this.workbooks_.getAll(email));
  }

  @Get('/active')
  async getActiveWorkbook(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(await this.workbooks_.getActive(email));
  }

  @Post('')
  async saveWorkbook(@Req() req: Request, @Res() res: Response, @Body() workbook: Workbook) {
    const email = (req as any).email;
    res.json(await this.workbooks_.save(email, workbook));
  }

  @Delete('/:id')
  async deleteWorkbook(@Req() req: Request, @Res() res: Response, @Params('id') id: string) {
    const email = (req as any).email;
    res.json(await this.workbooks_.remove(email, id));
  }
}
