export interface UserInfo {
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  allowed: boolean;
  active_budget: number;
}

export interface Budget {
  email: string;
  id: number;
  name: string;
}
