import { Service } from 'typedi';
import { Controller, Get } from '@tosarus/routing-express';
import { Forecasts, Trans } from '../../demo';
import { CheckToken } from '../middleware';

@Controller('/demo')
@Service()
export class DemoController {
  @Get('/forecast')
  getForecast() {
    return Forecasts.getForecast();
  }

  @Get('/trans', [CheckToken])
  getTransactions() {
    return Trans.getTransactions();
  }
}
