import { Injectable } from '@decorators/di';
import { UserInfo } from '@shared/types';
import db, { isAdmin } from '../db';

type DbUser = {
  id: string;
  name: string;
  picture: string;
  allowed: boolean;
  active_workbook: string;
};

const convertUser = ({ id, ...user }: DbUser): UserInfo => ({ ...user, email: id, is_admin: isAdmin(id) });

@Injectable()
export class UserRepository {
  async getAll() {
    const { rows } = await db().query<DbUser>('select * from users');
    return rows.map(convertUser);
  }

  async findByEmail(email: string) {
    const { rows } = await db().query<DbUser>({
      text: 'select * from users where id = $1',
      values: [email],
    });
    return rows.length > 0 ? convertUser(rows[0]) : null;
  }

  async create(user: Partial<UserInfo>): Promise<UserInfo> {
    const { email, name, picture } = user;
    const { rows } = await db().query<DbUser>({
      text: `
insert into users(id, name, picture, allowed)
values($1, $2, $3, $4)
returning *`,
      values: [email, name, picture, isAdmin(email!)],
    });
    return convertUser(rows[0]);
  }

  async update(email: string, user: Partial<UserInfo>): Promise<UserInfo> {
    const { name, picture, allowed, active_workbook } = user;
    const { rows } = await db().query<DbUser>({
      text: `
update users
set name = coalesce($2, name),
    picture = coalesce($3, picture),
    allowed = coalesce($4, allowed),
    active_workbook = coalesce($5, active_workbook)
where id = $1
returning *`,
      values: [email, name, picture, allowed, active_workbook],
    });
    return convertUser(rows[0]);
  }

  async remove(email: string) {
    return await db().query({ text: 'delete from users when id = $1', values: [email] });
  }
}
