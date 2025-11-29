import { BankApp } from './types';

export const DEMO_BANKS: BankApp[] = [
  { id: 'sber', name: 'Сбербанк', color: 'bg-green-600', scheme: 'sberbank://' },
  { id: 'tinkoff', name: 'Т-Банк', color: 'bg-yellow-500', scheme: 'tinkoffbank://' },
  { id: 'alfa', name: 'Альфа-Банк', color: 'bg-red-600', scheme: 'alfabank://' },
  { id: 'vtb', name: 'ВТБ', color: 'bg-blue-700', scheme: 'vtb://' },
];