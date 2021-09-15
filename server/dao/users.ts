import db from './db';
import { DbUser } from './types';

export { DbUser as Type };

export async function getAll(): Promise<DbUser[]> {
  const { rows } = await db().query<DbUser>('select email, name, picture, is_admin, allowed from users');
  return rows;
}

export async function findByEmail(email: string): Promise<DbUser | null> {
  const { rows } = await db().query<DbUser>({
    text: 'select email, name, picture, is_admin, allowed from users where email = $1',
    values: [email],
  });
  return rows.length > 0 ? rows[0] : null;
}

export async function update(email: string, user: Partial<DbUser>): Promise<DbUser> {
  const { rows } = await db().query<DbUser>({
    text: `update users
           set name = coalesce($2, name),
               picture = coalesce($3, picture),
               is_admin = coalesce($4, is_admin),
               allowed = coalesce($5, allowed)
           where email = $1
           returning *`,
    values: [email, user.name, user.picture, user.is_admin, user.allowed],
  });
  return rows[0];
}

export async function create(user: Partial<DbUser>): Promise<DbUser> {
  const { rows } = await db().query<DbUser>({
    text: `insert into users(email, name, picture, is_admin, allowed)
           values($1, $2, $3, $4, $5)
           returning *`,
    values: [user.email, user.name, user.picture, user.is_admin, user.allowed],
  });
  return rows[0];
}
