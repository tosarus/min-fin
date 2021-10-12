import { Injectable } from '@decorators/di';
import { Workbook } from '@shared/types';
import db from '../db';

@Injectable()
export class WorkbookRepository {
  async getAll(email: string): Promise<Workbook[]> {
    const { rows } = await db().query<Workbook>({
      text: 'select wb.id, wb.name from workbooks wb join users on wb.user_id = users.id and users.email = $1',
      values: [email],
    });
    return rows;
  }

  async getById(email: string, id: number): Promise<Workbook | null> {
    const { rows } = await db().query<Workbook>({
      text: `
select wb.id, wb.name from workbooks wb join users on wb.user_id = users.id
where wb.id = $2 and users.email = $1`,
      values: [email, id],
    });
    if (rows.length > 0) {
      return rows[0];
    }
    throw `no workbook ${id} for the user ${email}`;
  }

  async findActive(email: string): Promise<Workbook | null> {
    const { rows } = await db().query<Workbook>({
      text: `
select wb.id, wb.name from workbooks wb join users on wb.user_id = users.id
where wb.id = users.active_workbook and users.email = $1`,
      values: [email],
    });
    return rows.length > 0 ? rows[0] : null;
  }

  async update(email: string, workbook: Partial<Workbook>): Promise<Workbook> {
    const { rows } = await db().query<Workbook>({
      text: `
update workbooks wb set name = coalesce($3, wb.name)
from users where wb.user_id = users.id and wb.id = $2 and users.email = $1
returning wb.id, wb.name`,
      values: [email, workbook.id, workbook.name],
    });
    return rows[0];
  }

  async create(email: string, workbook: Partial<Workbook>): Promise<Workbook> {
    const { rows } = await db().query<Workbook>({
      text: `
insert into workbooks(user_id, name)
(select users.id as user_id, $2 as name from users where users.email = $1)
returning id, name`,
      values: [email, workbook.name],
    });
    return rows[0];
  }

  async remove(email: string, id: number) {
    await db().query({
      text: 'delete from workbooks wb using users where wb.user_id = users.id and wb.id = $2 and users.email = $1',
      values: [email, id],
    });
    return { id };
  }
}
