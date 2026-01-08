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
}


export interface Client extends UserProfile {

}

export interface Business extends UserProfile {
  businessLogo: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
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

export interface AuthContextType {
  loading: boolean;
  logout: () => Promise<void>;
  userDetails: Business | null;
}