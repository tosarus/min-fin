export interface UserInfo {
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  allowed: boolean;
  active_workbook: number;
}

export interface Workbook {
  id: number;
  name: string;
}
