import { Workbook } from '@shared/types';
import { AbstractRepository } from './AbstractRepository';

export class WorkbookRepository extends AbstractRepository {
  async getAll(email: string): Promise<Workbook[]> {
    const { rows } = await this.qm().query<Workbook>({
      text: 'select id, name from workbooks where user_id = $1',
      values: [email],
    });
    return rows;
  }

  async getById(email: string, id: string): Promise<Workbook | null> {
    const { rows } = await this.qm().query<Workbook>({
      text: 'select id, name from workbooks where user_id = $1 and id = $2',
      values: [email, id],
    });
    if (rows.length > 0) {
      return rows[0];
    }
    throw `no workbook ${id} for the user ${email}`;
  }

  async findActive(email: string): Promise<Workbook | null> {
    const { rows } = await this.qm().query<Workbook>({
      text: `
select wb.id, wb.name from workbooks wb join users on wb.user_id = users.id
where wb.id = users.active_workbook and users.id = $1`,
      values: [email],
    });
    return rows.length > 0 ? rows[0] : null;
  }

  async update(email: string, workbook: Partial<Workbook>): Promise<Workbook> {
    const { rows } = await this.qm().query<Workbook>({
      text: `
update workbooks wb set name = coalesce($3, wb.name)
from users where wb.user_id = users.id and wb.id = $2 and users.id = $1
returning wb.id, wb.name`,
      values: [email, workbook.id, workbook.name],
    });
    return rows[0];
  }

  async create(email: string, workbook: Partial<Workbook>): Promise<Workbook> {
    const { rows } = await this.qm().query<Workbook>({
      text: 'insert into workbooks(user_id, name) values($1, $2) returning id, name',
      values: [email, workbook.name],
    });
    return rows[0];
  }

  async remove(email: string, id: string) {
    await this.qm().query({
      text: 'delete from workbooks where user_id = $1 and id = $2',
      values: [email, id],
    });
    return { id };
  }
}
