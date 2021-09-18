import * as Actions from './demoActions';
import { ActionsType } from '../actions';
import { WeatherForecast, CsvTrans } from '../types';

const initialState: {
  forecast: WeatherForecast[] | null;
  trans: CsvTrans[] | null;
} = {
  forecast: null,
  trans: null,
};

function demoReducer(state = initialState, action: ActionsType<typeof Actions>) {
  switch (action.type) {
    case Actions.LOAD_FORECAST_DONE:
      return { ...state, forecast: action.forecast };

    case Actions.LOAD_TRANSACTIONS_DONE:
      return { ...state, trans: action.trans };

    default:
      return state;
  }
}

export const reducer = {
  demo: demoReducer,
};

export function selectors<Store extends { demo: typeof initialState }>() {
  return {
    forecast: (store: Store) => store.demo.forecast,
    transactions: (store: Store) => store.demo.trans,
  };
}
