export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  logo?: string;
  phoneNumber?: string;
  address: string;
}


export interface Client extends UserProfile {

}

export interface BusinessInfo extends UserProfile {
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
  currency: string;
}