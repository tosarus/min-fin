import { Response } from 'express';
import { Controller, Get, Response as Res } from '@decorators/express';
import { Forecasts, Trans } from '../../demo';
import { CheckToken } from '../middleware/CheckToken';

@Controller('/demo')
export class DemoController {
  @Get('/forecast')
  async getForecast(@Res() res: Response) {
    res.json(await Forecasts.getForecast());
  }

  @Get('/trans', [CheckToken])
  async getTransactions(@Res() res: Response) {
    res.json(await Trans.getTransactions());
  }
}
