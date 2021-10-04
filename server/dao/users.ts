import db, { isAdmin } from './db';
import { DbUser } from './types';

export { DbUser as Type, isAdmin };

const adminify = (user: DbUser) => ({ ...user, is_admin: isAdmin(user.email) });

export async function getAll(): Promise<DbUser[]> {
  const { rows } = await db().query<DbUser>('select * from users');
  return rows.map(adminify);
}

export async function findByEmail(email: string): Promise<DbUser | null> {
  const { rows } = await db().query<DbUser>({
    text: 'select * from users where email = $1',
    values: [email],
  });
  return rows.length > 0 ? adminify(rows[0]) : null;
}

export async function update(email: string, user: Partial<DbUser>): Promise<DbUser> {
  const { rows } = await db().query<DbUser>({
    text: `update users
           set name = coalesce($2, name),
               picture = coalesce($3, picture),
               allowed = coalesce($4, allowed),
               active_workbook = coalesce($5, active_workbook)
           where email = $1
           returning *`,
    values: [email, user.name, user.picture, user.allowed, user.active_workbook],
  });

  return adminify(rows[0]);
}

export async function create(user: Partial<DbUser>): Promise<DbUser> {
  const { rows } = await db().query<DbUser>({
    text: `insert into users(email, name, picture, allowed)
           values($1, $2, $3, $4)
           returning *`,
    values: [user.email, user.name, user.picture, user.allowed],
  });
  return adminify(rows[0]);
}

export function remove(email: string) {
  return db().query({ text: 'delete from users when email = $1', values: [email] });
}
