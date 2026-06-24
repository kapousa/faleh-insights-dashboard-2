export interface Question {
  text: string;
  options: string[];
}

export interface Phase {
  id: number;
  phase: string;
  name: string;
  objective: string;
  desc: string;
  questions: Question[];
}

export interface BizData {
  name: string;
  sector: string;
  locations: string;
  years: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  companyName: string;
  vatNumber: string;
}

export type ScreenType = 'welcome' | 'verify' | 'contact' | 'wizard' | 'processing' | 'gate' | 'payment' | 'confirm';

export type AnswersState = Record<number, Record<number, number>>;