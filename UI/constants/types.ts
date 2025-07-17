export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address?: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: Client | null;
  businessInfo: BusinessInfo;
  invoiceDate: Date;
  dueDate: Date;
  lineItems: LineItem[];
  taxPercentage: number;
  notes: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  isDraft: boolean;
}