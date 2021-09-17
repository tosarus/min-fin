export const GET_INITIAL_STATE = '@@init/GET_INITIAL_STATE';

export const getInitialState = () => ({ type: GET_INITIAL_STATE } as const);
