export interface DbUser {
  id: number;
  email: string;
  name: string;
  locale: string;
  avatar: string;
  is_admin: boolean;
  allowed: boolean;
}
