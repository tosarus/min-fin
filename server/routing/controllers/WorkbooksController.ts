import { Service } from 'typedi';
import { Body, Controller, Delete, Get, Param, Post } from '@shared/routing-controllers';
import { Workbook } from '@shared/types';
import { WorkbooksService } from '../../services';
import { CheckToken, Email } from '../middleware';

@Controller('/workbooks', [CheckToken])
@Service()
export class WorkbooksController {
  constructor(private workbooks_: WorkbooksService) {}

  @Get()
  getWorkbooks(@Email() email: string) {
    return this.workbooks_.getAll(email);
  }

  @Get('/active')
  getActiveWorkbook(@Email() email: string) {
    return this.workbooks_.getActive(email);
  }

  @Post()
  saveWorkbook(@Email() email: string, @Body() workbook: Workbook) {
    return this.workbooks_.save(email, workbook);
  }

  @Delete('/:id')
  deleteWorkbook(@Email() email: string, @Param('id') id: string) {
    return this.workbooks_.remove(email, id);
  }
}
