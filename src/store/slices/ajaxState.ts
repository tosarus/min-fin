import { all } from 'redux-saga/effects';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AjaxState {
  count: number;
  messages: string[];
}
const initialState: AjaxState = { count: 0, messages: [] };

const { reducer: ajaxState, actions } = createSlice({
  name: 'ajaxState',
  initialState,
  reducers: {
    beginAjaxCall(state, { payload: message }: PayloadAction<string>) {
      state.count = state.count + 1;
      state.messages.push(message);
    },
    stopAjaxCall(state, { payload: message }: PayloadAction<string>) {
      state.count = Math.max(state.count - 1, 0);
      const index = state.messages.findIndex((m) => m === message);
      if (index > -1) {
        state.messages.splice(index, 1);
      }
    },
  },
});

const reducer = {
  ajaxState,
};

function selectors<Store extends { ajaxState: typeof initialState }>() {
  return {
    ajaxState: (store: Store) => store.ajaxState,
  };
}

// empty
function* saga() {
  yield all([]);
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
