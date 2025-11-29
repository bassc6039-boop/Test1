export enum PaymentStatus {
  IDLE = 'IDLE',
  GENERATING_QR = 'GENERATING_QR',
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type PaymentMode = 'C2B' | 'C2C' | 'REAL_STATIC';

export interface BankApp {
  id: string;
  name: string;
  color: string;
  scheme: string; // deeply link scheme (simulated)
}

export interface TransactionDetails {
  amount: number;
  description: string;
  orderId: string;
}