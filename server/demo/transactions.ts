import * as csv from '@fast-csv/parse';
import fs from 'fs';
import path from 'path';

// "Date","Description","Original Description","Amount","Transaction Type","Category","Account Name","Labels","Notes"
interface CsvTrans {
  date: string;
  descr: string;
  amount: number;
  type: string;
  category: string;
  account: string;
}

let _trans: CsvTrans[];

function createData(date: string, descr: string, amount: number, type: string, category: string, account: string) {
  return { date, descr, amount, type, category, account };
}

function loadTrans(): CsvTrans[] {
  const trans: CsvTrans[] = [];
  fs.createReadStream(path.resolve(__dirname, '../assets/transactions.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
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
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
  return trans;
}

export const getTransactions = (): CsvTrans[] => {
  return _trans || (_trans = loadTrans());
};
