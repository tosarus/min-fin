import db from './db';
import { DbUser } from './types';

export { DbUser as Type };

const table = 'users';

export function getAll(): Promise<DbUser[]> {
  return db()
    .query({ text: 'select * from $1', values: [table] })
    .then((res) => res.rows.map((row) => row as DbUser));
}

export function findByEmail(email: string): Promise<DbUser | null> {
  return db()
    .query({ text: 'select * from $1 where email = $2', values: [table, email] })
    .then((res) => (res.rows.length > 0 ? res.rows[0] : null));
}

export function save(user: Partial<DbUser>): Promise<DbUser> {
  return db()
    .query({
      text: `insert into $1(email, name, locale, avatar, is_admin, allowed)
             values($2, $3, $4, $5, $6, $7)
             on conflict(email) do update
                set name = coalesce(EXLUDED.name, $1.name),
                    locale = coalesce(EXLUDED.locale, $1.locale),
                    avatar = coalesce(EXLUDED.avatar, $1.avatar),
                    is_admin = coalesce(EXLUDED.is_admin, $1.is_admin),
                    allowed = coalesce(EXLUDED.allowed, $1.allowed)
             returning *`,
      values: [table, user.email, user.name, user.locale, user.avatar, user.is_admin, user.allowed],
    })
    .then((res) => res.rows[0]);
}
