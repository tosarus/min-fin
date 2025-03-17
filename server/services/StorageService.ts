import currency from 'currency.js';
import { Service } from 'typedi';
import { parseString } from '@fast-csv/parse';
import { getMinDate, sanitizeDate } from '@shared/calcs';
import { Account, AccountType, ImportTransaction, Transaction, TransactionType, WorldUpdate } from '@shared/types';
import { AccountRepository, TransactionRepository } from '../repositories';
import { BaseService } from './BaseService';
import { InTransaction } from './InTransaction';

@Service()
export class StorageService extends BaseService {
  parseTransactions(importString: string): Promise<ImportTransaction[]> {
    return parseTransString(importString);
  }

  importTransactions(workbookId: string, transactions: ImportTransaction[]): Promise<WorldUpdate> {
    const imported = this.processImport(workbookId, transactions);
    return this.saveImport(workbookId, imported);
  }

  async exportTransactions(workbookId: string): Promise<ImportTransaction[]> {
    const accountRepo = this.resolve(AccountRepository);
    const transactionRepo = this.resolve(TransactionRepository);

    const accounts = await accountRepo.getForWorkbook(workbookId);
    const accountMap = new Map<string, Account>(accounts.map((acc) => [acc.id, acc]));
    const transactions = await transactionRepo.getAll(workbookId);

    const output = [] as ImportTransaction[];
    for (const trans of transactions) {
      const out = {
        date: sanitizeDate(trans.date),
        descr: trans.description,
        detail: trans.detail || '',
        amount: currency(trans.amount).value,
      };
      switch (trans.type) {
        case TransactionType.Expence:
          output.push({
            ...out,
            type: 'debit',
            category: accountMap.get(trans.account_to)?.name || '',
            account: accountMap.get(trans.account_from)?.name || '',
          });
          break;

        case TransactionType.Income:
          output.push({
            ...out,
            type: 'credit',
            category: accountMap.get(trans.account_from)?.name || '',
            account: accountMap.get(trans.account_to)?.name || '',
          });
          break;

        case TransactionType.Transfer:
          output.push({
            ...out,
            type: 'debit',
            category: 'Transfer',
            account: accountMap.get(trans.account_from)?.name || '',
          });
          output.push({
            ...out,
            amount: currency(trans.amount).value,
            type: 'credit',
            category: 'Transfer',
            account: accountMap.get(trans.account_to)?.name || '',
          });
          break;

        case TransactionType.Opening:
          {
            let amount = currency(trans.amount).value;
            let type;
            if (amount < 0) {
              amount *= -1;
              type = 'debit';
            } else {
              type = 'credit';
            }

            output.push({
              ...out,
              amount,
              type,
              category: 'Transfer',
              account: accountMap.get(trans.account_to)?.name || '',
            });
          }
          break;
      }
    }
    return output;
  }

  @InTransaction()
  async saveImport(workbookId: string, imported: WorldUpdate): Promise<WorldUpdate> {
    const accountRepo = this.resolve(AccountRepository);
    const transactionRepo = this.resolve(TransactionRepository);

    const accounts = [] as Account[];
    const accNameToId = new Map<string, string>();
    for (const acc of imported.accounts!) {
      const saved = await accountRepo.create(workbookId, acc);
      accNameToId.set(saved.name, saved.id);
      accounts.push(saved);
    }

    const transactions = [] as Transaction[];
    for (const trans of imported.transactions || []) {
      const account_from = accNameToId.get(trans.account_from);
      const account_to = accNameToId.get(trans.account_to);
      if (!account_from) {
        throw `unexpected account name ${trans.account_from}`;
      }
      if (!account_to) {
        throw `unexpected account name ${trans.account_to}`;
      }
      trans.account_from = account_from;
      trans.account_to = account_to;
      transactions.push(await transactionRepo.create(workbookId, trans));
    }

    return { accounts, transactions };
  }

  processImport(workbook_id: string, rawTransactions: ImportTransaction[]): WorldUpdate {
    const transferCategories = ['Transfer', 'Credit Card Payment'];
    const accountCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();
    const transferCandidates = [] as ImportTransaction[];
    rawTransactions.forEach((tr) => {
      if (transferCategories.includes(tr.category)) {
        transferCandidates.push(tr);
        let count = accountCounts.get(tr.account) ?? 0;
        count += tr.type === 'credit' ? 1 : -1;
        accountCounts.set(tr.account, count);
      } else {
        let count = categoryCounts.get(tr.category) ?? 0;
        count += tr.type === 'credit' ? 1 : -1;
        categoryCounts.set(tr.category, count);
      }
    });
    console.log(`${accountCounts.size} accounts`);
    console.log(`${categoryCounts.size} categories`);

    type Transfer = [from: ImportTransaction, to: ImportTransaction];
    const transfers = [] as Transfer[];
    const foundTransfers = new Set<ImportTransaction>();
    let hasTransferCategory = false;
    transferCandidates.forEach((tr) => {
      if (foundTransfers.has(tr)) {
        return;
      }
      const trDate = Date.parse(tr.date);
      const other = transferCandidates.find((t) => {
        if (t === tr || foundTransfers.has(t)) {
          return false;
        } else if (tr.amount !== t.amount || tr.type == t.type) {
          return false;
        }
        const dateDiff = Math.abs(trDate - Date.parse(t.date)) / (1000 * 3600 * 24);
        return dateDiff < 5;
      });

      if (!other) {
        hasTransferCategory = true;
        return;
      }
      if (tr.type === 'credit') {
        transfers.push([other, tr]);
      } else {
        transfers.push([tr, other]);
      }
      foundTransfers.add(tr);
      foundTransfers.add(other);
    });

    console.log(`${transfers.length} transfers`);

    const makeAccount = (name: string, type: AccountType) => ({
      id: name,
      workbook_id,
      name,
      type,
      balance: '0',
    });
    const accounts = [] as Account[];
    accountCounts.forEach((count, name) => {
      const account = makeAccount(name, count > 0 ? AccountType.Credit : AccountType.Banking);
      accounts.push(account);
    });

    categoryCounts.forEach((count, name) => {
      const account = makeAccount(name, count > 0 ? AccountType.Income : AccountType.Expence);
      accounts.push(account);
    });

    if (hasTransferCategory) {
      transferCategories.forEach((category) => {
        const account = makeAccount(category, AccountType.Expence);
        accounts.push(account);
      });
    }
    console.log(`${accounts.length} accounts and categories imported`);

    const transactions = [] as Transaction[];
    rawTransactions.forEach((rawTr) => {
      if (foundTransfers.has(rawTr)) {
        return;
      }
      const isIncome = (categoryCounts.get(rawTr.category) ?? 0) > 0;
      const trans: Transaction = {
        id: transactions.length.toString(),
        workbook_id,
        date: rawTr.date,
        type: isIncome ? TransactionType.Income : TransactionType.Expence,
        description: rawTr.descr,
        detail: rawTr.detail,
        order: transactions.length,
        amount: currency(rawTr.amount).format(),
        account_from: isIncome ? rawTr.category : rawTr.account,
        account_to: isIncome ? rawTr.account : rawTr.category,
        pending: false,
        recurring: false,
      };
      transactions.push(trans);
    });
    transfers.forEach(([rawFrom, rawTo]) => {
      const trans: Transaction = {
        id: transactions.length.toString(),
        workbook_id,
        date: getMinDate(rawFrom.date, rawTo.date),
        type: TransactionType.Transfer,
        description: rawFrom.descr,
        order: transactions.length,
        amount: currency(rawFrom.amount).format(),
        account_from: rawFrom.account,
        account_to: rawTo.account,
        pending: false,
        recurring: false,
      };
      transactions.push(trans);
    });
    console.log(`${transactions.length} transaction imported`);

    return { accounts, transactions };
  }
}

function parseTransString(input: string) {
  // "Date","Description","Original Description","Amount","Transaction Type","Category","Account Name","Labels","Notes"
  const headers = ['date', 'descr', 'detail', 'amount', 'type', 'category', 'account', undefined, undefined];

  return new Promise<ImportTransaction[]>((resolve, reject) => {
    const trans: ImportTransaction[] = [];
    parseString(input, {
      headers,
      renameHeaders: true,
      discardUnmappedColumns: true,
    })
      .on('error', (error) => reject(error))
      .on('data', (dt) => trans.push(dt))
      .on('end', () => resolve(trans));
  });
}
