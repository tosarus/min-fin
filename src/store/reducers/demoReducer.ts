import { DemoActionTypes, LOAD_FORECAST_DONE, LOAD_TRANSACTIONS_DONE } from '../actions';
import { WeatherForecast, CsvTrans } from '../types';

const initialState: {
  forecast: WeatherForecast[] | null;
  trans: CsvTrans[] | null;
} = {
  forecast: null,
  trans: null,
};

export default function forecastReducer(state = initialState, action: DemoActionTypes) {
  switch (action.type) {
    case LOAD_FORECAST_DONE:
      return { ...state, forecast: action.forecast };

    case LOAD_TRANSACTIONS_DONE:
      return { ...state, trans: action.trans };

    default:
      return state;
  }
}
