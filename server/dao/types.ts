export interface DbUser {
  id: number;
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  allowed: boolean;
  active_workbook: number;
}

export interface DbWorkbook {
  id: number;
  name: string;
  user_id: number;
}
