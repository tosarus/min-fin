import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';

type RenderStateFn<State> = (state: NonNullable<State>) => React.ReactElement;
type DispatchedRenderFn<State> = (render: RenderStateFn<State>) => React.ReactElement;

export function useDispatchedRender<State>(selector: () => State, action: () => AnyAction): DispatchedRenderFn<State> {
  const state = selector();
  const dispath = useDispatch();

  useEffect(() => {
    if (!state) {
      dispath(action());
    }
  }, [state, action, dispath]);

  return (render: RenderStateFn<State>) => (state ? render(state!) : <CircularProgress />);
}
