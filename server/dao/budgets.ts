import db from './db';
import { DbBudget } from './types';

export { DbBudget as Type };

export async function getAll(email: string) {
  const { rows } = await db().query<DbBudget>({
    text: 'select b.id, b.name from budgets b join users u on b.user_id = u.id and u.email = $1',
    values: [email],
  });
  return rows;
}

export async function getActive(email: string) {
  const { rows } = await db().query<DbBudget>({
    text: 'select b.id, b.name from budgets b join users u on b.id = u.active_budget and u.email = $1',
    values: [email],
  });
  return rows.length > 0 ? rows[0] : null;
}

export async function update(email: string, budget: Partial<DbBudget>) {
  const { rows } = await db().query<DbBudget>({
    text: `update budgets b set name = coalesce($3, b.name)
           from users u where b.user_id = u.id and b.id = $2 and u.email = $1
           returning b.id, b.name`,
    values: [email, budget.id, budget.name],
  });
  return rows[0];
}

export async function create(email: string, budget: Partial<DbBudget>) {
  const { rows } = await db().query<DbBudget>({
    text: `insert into budgets(user_id, name)
           (select users.id as user_id, $2 as name from users where users.email = $1)
           returning *`,
    values: [email, budget.name],
  });
  return rows[0];
}

export function remove(email: string, id: number) {
  return db().query({
    text: 'delete from budgets b using users u where b.user_id = u.id and b.id = $2 and u.email = $1',
    values: [email, id],
  });
}
