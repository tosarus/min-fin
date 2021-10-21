import { Service } from 'typedi';
import { Controller, Get } from '@shared/routing-controllers';
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
