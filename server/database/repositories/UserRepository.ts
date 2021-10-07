import { Injectable } from '@decorators/di';
import { UserInfo } from '@shared/types';
import db, { isAdmin } from '../db';

type DbUser = {
  id: number;
  email: string;
  name: string;
  picture: string;
  allowed: boolean;
  active_workbook: number;
};

const convertUser = (user: DbUser): UserInfo => ({ ...user, is_admin: isAdmin(user.email) });

export type { UserInfo };

@Injectable()
export class UserRepository {
  async getAll() {
    const { rows } = await db().query<DbUser>('select * from users');
    return rows.map(convertUser);
  }

  async findByEmail(email: string) {
    const { rows } = await db().query<DbUser>({
      text: 'select * from users where email = $1',
      values: [email],
    });
    return rows.length > 0 ? convertUser(rows[0]) : null;
  }

  async create(user: Partial<UserInfo>): Promise<UserInfo> {
    const { rows } = await db().query<DbUser>({
      text: `
insert into users(email, name, picture, allowed)
values($1, $2, $3, $4)
returning *`,
      values: [user.email, user.name, user.picture, user.allowed],
    });
    return convertUser(rows[0]);
  }

  async update(email: string, user: Partial<UserInfo>): Promise<UserInfo> {
    const { rows } = await db().query<DbUser>({
      text: `
update users
set name = coalesce($2, name),
    picture = coalesce($3, picture),
    allowed = coalesce($4, allowed),
    active_workbook = coalesce($5, active_workbook)
where email = $1
returning *`,
      values: [email, user.name, user.picture, user.allowed, user.active_workbook],
    });
    return convertUser(rows[0]);
  }

  async remove(email: string) {
    return await db().query({ text: 'delete from users when email = $1', values: [email] });
  }
}
