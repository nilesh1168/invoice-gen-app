import { LineItem } from '../constants/types';

export const calculateLineItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateSubtotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((sum, item) => sum + item.total, 0);
};

export const calculateTaxAmount = (subtotal: number, taxPercentage: number): number => {
  return subtotal * (taxPercentage / 100);
};

export const calculateTotal = (subtotal: number, taxAmount: number): number => {
  return subtotal + taxAmount;
};