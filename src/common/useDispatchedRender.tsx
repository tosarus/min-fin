import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { LinearProgress } from '@mui/material';

type RenderStateFn<State> = (state: NonNullable<State>) => React.ReactElement;
type DispatchedRenderFn<State> = (render: RenderStateFn<State>) => React.ReactElement;

function defaultFalsifier<State>(state: State) {
  return !state;
}

export function useDispatchedRender<Store, State>(
  selector: (store: Store) => State,
  action: () => Action,
  falsifier: (state: State) => boolean = defaultFalsifier,
  loader: React.ReactElement = <LinearProgress />
): DispatchedRenderFn<State> {
  const state = useSelector(selector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (falsifier(state)) {
      dispatch(action());
    }
  }, [state, action, falsifier, dispatch]);

  return (render: RenderStateFn<State>) => (falsifier(state) ? loader : render(state!));
}
