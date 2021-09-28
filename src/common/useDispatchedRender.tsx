import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';

type RenderStateFn<State> = (state: NonNullable<State>) => React.ReactElement;
type DispatchedRenderFn<State> = (render: RenderStateFn<State>) => React.ReactElement;

function defaultFalsifier<State>(state: State) {
  return !state;
}

export function useDispatchedRender<Store, State>(
  selector: (store: Store) => State,
  action: () => AnyAction,
  falsifier: (state: State) => boolean = defaultFalsifier
): DispatchedRenderFn<State> {
  const state = useSelector(selector);
  const dispath = useDispatch();

  useEffect(() => {
    if (falsifier(state)) {
      dispath(action());
    }
  }, [state, action, falsifier, dispath]);

  return (render: RenderStateFn<State>) => (falsifier(state) ? <CircularProgress /> : render(state!));
}
