export interface DbUser {
  id: number;
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  allowed: boolean;
  active_budget: number;
}

export interface DbBudget {
  id: number;
  name: string;
}
