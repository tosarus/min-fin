import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { WorkbooksClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { Workbook } from '../../types';

const initialState = null as Workbook[] | null;

const {
  name,
  reducer: workbooksReducer,
  actions: {
    listWorkbooksDone,
    getActiveWorkbookDone,
    createWorkbookDone,
    updateWorkbookDone,
    removeWorkbookDone,
    resetWorkbooks,
  },
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
    createWorkbookDone(state, { payload: workbook }: PayloadAction<Workbook>) {
      if (!state) {
        return [workbook];
      }
      state.push(workbook);
    },
    updateWorkbookDone(state, { payload: workbook }: PayloadAction<Workbook>) {
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
    removeWorkbookDone(state, { payload: { id } }: PayloadAction<{ id: number }>) {
      if (state) {
        const index = state.findIndex((b) => b.id === id);
        if (index > -1) {
          state.splice(index, 1);
        }
      }
    },
    resetWorkbooks() {
      return initialState;
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
    *createWorkbook({ payload: workbook }: PayloadAction<Partial<Workbook>>) {
      yield callPrivate(createWorkbookDone, 'Creating workbook', (auth) => new WorkbooksClient(auth).create(workbook));
    },
    *updateWorkbook({ payload: workbook }: PayloadAction<Partial<Workbook>>) {
      yield callPrivate(updateWorkbookDone, 'Updating workbook', (auth) => new WorkbooksClient(auth).update(workbook));
    },
    *removeWorkbook({ payload: id }: PayloadAction<number>) {
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
  actions: { ...actions, resetWorkbooks },
  reducer,
  saga,
  selectors,
};
