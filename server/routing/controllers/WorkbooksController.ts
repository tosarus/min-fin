import { Response, Request } from 'express';
import { Body, Controller, Delete, Get, Params, Post, Put, Response as Res, Request as Req } from '@decorators/express';
import { CheckToken } from '../middleware';
import { Workbook, WorkbookRepository } from '../../database';
import { Inject } from '@decorators/di';

@Controller('/workbooks', [CheckToken])
export class WorkbooksController {
  constructor(@Inject(WorkbookRepository) private repository_: WorkbookRepository) {}

  @Get('')
  async getWorkbooks(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(await this.repository_.getAll(email));
  }

  @Get('/active')
  async getActiveWorkbook(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(await this.repository_.findActive(email));
  }

  @Post('')
  async createWorkbook(@Req() req: Request, @Res() res: Response, @Body() workbook: Workbook) {
    const email = (req as any).email;
    if (!workbook?.name) {
      throw 'New workbook: should have a name';
    }
    res.json(await this.repository_.create(email, workbook));
  }

  @Put('')
  async updateWorkbook(@Req() req: Request, @Res() res: Response, @Body() workbook: Workbook) {
    const email = (req as any).email;
    if (!workbook) {
      throw 'Update workbook: should have a body';
    }
    res.json(await this.repository_.update(email, workbook));
  }

  @Delete('/:id(\\d+)')
  async deleteWorkbook(@Req() req: Request, @Res() res: Response, @Params('id') id: string) {
    const email = (req as any).email;
    res.json(await this.repository_.remove(email, +id));
  }
}
