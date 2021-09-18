export const GET_INITIAL_STATE = '@@init/GET_INITIAL_STATE';

export const getInitialState = () => ({ type: GET_INITIAL_STATE } as const);

export type ActionsType<TActions> = {
  [Name in keyof TActions]: TActions[Name] extends (...args: any[]) => any ? ReturnType<TActions[Name]> : never;
}[keyof TActions];
