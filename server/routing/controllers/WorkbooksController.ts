import { Response, Request } from 'express';
import { Body, Controller, Delete, Get, Params, Post, Put, Response as Res, Request as Req } from '@decorators/express';
import { Workbook } from '@shared/types';
import { CheckToken } from '../middleware';
import { WorkbookDao } from '../../database';

@Controller('/workbooks', [CheckToken])
export class WorkbooksController {
  @Get('')
  async getWorkbooks(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(await WorkbookDao.getAll(email));
  }

  @Get('/active')
  async getActiveWorkbook(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(await WorkbookDao.findActive(email));
  }

  @Post('')
  async createWorkbook(@Req() req: Request, @Res() res: Response, @Body() workbook: Workbook) {
    const email = (req as any).email;
    if (!workbook?.name) {
      throw 'New workbook: should have a name';
    }
    res.json(await WorkbookDao.create(email, workbook));
  }

  @Put('')
  async updateWorkbook(@Req() req: Request, @Res() res: Response, @Body() workbook: Workbook) {
    const email = (req as any).email;
    if (!workbook) {
      throw 'Update workbook: should have a body';
    }
    res.json(await WorkbookDao.update(email, workbook));
  }

  @Delete('/:id(\\d+)')
  async deleteWorkbook(@Req() req: Request, @Res() res: Response, @Params('id') id: string) {
    const email = (req as any).email;
    res.json(await WorkbookDao.remove(email, +id));
  }
}
