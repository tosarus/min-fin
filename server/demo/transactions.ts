import * as csv from '@fast-csv/parse';
import path from 'path';
import { CsvTrans } from '@shared/types';

let _trans: CsvTrans[];

function createData(date: string, descr: string, amount: number, type: string, category: string, account: string) {
  return { date, descr, amount, type, category, account };
}

export const getTransactions = (): Promise<CsvTrans[]> => {
  return new Promise((resolve, reject) => {
    if (_trans) {
      resolve(_trans);
      return;
    }

    const trans: CsvTrans[] = [];
    csv
      .parseFile(path.resolve(__dirname, '../../assets/transactions.csv'), {
        headers: true,
      })
      .on('error', (error) => reject(error))
      .on('data', (dt: any) =>
        trans.push(
          createData(
            dt['Date'],
            dt['Description'],
            +dt['Amount'],
            dt['Transaction Type'],
            dt['Category'],
            dt['Account Name']
          )
        )
      )
      .on('end', () => resolve((_trans = trans)));
  });
};
