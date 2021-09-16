type ActionCreators = typeof import('../actions');

type ActionsType = {
  [Name in keyof ActionCreators]: ActionCreators[Name] extends (...args: any[]) => any
    ? ReturnType<ActionCreators[Name]>
    : never;
}[keyof ActionCreators];

export default ActionsType;
