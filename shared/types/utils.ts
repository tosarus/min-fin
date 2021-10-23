import { AccountType } from './serverTypes';

export function getAssetAccountTypes() {
  return [AccountType.Banking, AccountType.Credit];
}

export function getBudgetAccountTypes() {
  return [AccountType.Income, AccountType.Expence];
}

export function getPublicAccountTypes() {
  return [...getAssetAccountTypes(), ...getBudgetAccountTypes()];
}
