export interface DbUser {
  id: number;
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  allowed: boolean;
}
