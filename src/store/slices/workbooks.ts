import { createSliceSaga, SagaType } from 'redux-toolkit-saga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workbook, WorldUpdate } from '../../types';
import { WorkbooksClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { applyWorldUpdate } from './transactions';

const initialState = null as Workbook[] | null;

const {
  name,
  reducer: workbooksReducer,
  actions: { listWorkbooksDone, getActiveWorkbookDone, saveWorkbookDone, removeWorkbookDone },
} = createSlice({
  name: 'workbooks',
  initialState,
  reducers: {
    listWorkbooksDone(state, { payload: workbookList }: PayloadAction<Workbook[]>) {
      return workbookList;
    },
    getActiveWorkbookDone(state, { payload: workbook }: PayloadAction<Workbook>) {
      if (!workbook) {
        return state;
      }

      if (!state) {
        return [workbook];
      }

      const index = state.findIndex((b) => b.id === workbook.id);
      if (index === -1) {
        state.push(workbook);
      } else {
        state[index] = workbook;
      }
    },
    saveWorkbookDone(state, { payload: workbook }: PayloadAction<Workbook>) {
      if (!state) {
        return [workbook];
      }
      const index = state.findIndex((b) => b.id === workbook.id);
      if (index > -1) {
        state[index] = workbook;
      } else {
        state.push(workbook);
      }
    },
    removeWorkbookDone(state, { payload: { id } }: PayloadAction<{ id: string }>) {
      if (state) {
        const index = state.findIndex((b) => b.id === id);
        if (index > -1) {
          state.splice(index, 1);
        }
      }
    },
  },
  extraReducers: {
    [applyWorldUpdate.type]: (state, { payload: { workbooks } }: PayloadAction<WorldUpdate>) => {
      if (!state) {
        return workbooks;
      }
      if (workbooks.length === 0) {
        return state;
      }
      workbooks.forEach((update) => {
        const index = state.findIndex((wb) => wb.id === update.id);
        if (index > -1) {
          state.splice(index, 1, update);
        } else {
          state.push(update);
        }
      });
    },
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *listWorkbooks() {
      yield callPrivate(listWorkbooksDone, 'Loading workbook list', (auth) => new WorkbooksClient(auth).list());
    },
    *getActiveWorkbook() {
      yield callPrivate(getActiveWorkbookDone, 'Loading active workbook', (auth) => new WorkbooksClient(auth).getActive());
    },
    *saveWorkbook({ payload: workbook }: PayloadAction<Partial<Workbook>>) {
      yield callPrivate(saveWorkbookDone, 'Saving workbook', (auth) => new WorkbooksClient(auth).save(workbook));
    },
    *removeWorkbook({ payload: id }: PayloadAction<string>) {
      yield callPrivate(removeWorkbookDone, 'Removing workbook', (auth) => new WorkbooksClient(auth).remove(id));
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  workbooks: workbooksReducer,
};

function selectors<Store extends { workbooks: typeof initialState }>() {
  return {
    workbooks: (store: Store) => store.workbooks,
  };
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
