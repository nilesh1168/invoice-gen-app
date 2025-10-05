import { LineItem } from '../constants/types';

const LIMIT = 100_000_000;

export const calculateLineItemTotal = (quantity: number, unitPrice: number): number => {
  // if quatity or unitPrice or (quantity*unitPrice) is greater than LIMIT or less than 0 return -1
  if (quantity < 0 || unitPrice < 0 || quantity > LIMIT || unitPrice > LIMIT || quantity * unitPrice > LIMIT) {
    return -1;
  }
  return quantity * unitPrice;
};

export const calculateSubtotal = (lineItems: LineItem[]): number => {
  // if final sum is greater than LIMIT or less than 0 return -1
  // if item.total is greater than LIMIT return -1; if item.total is less than 0 skip the record
  const total = lineItems.reduce((sum, item) => {
    if (item.total < 0) return sum;
    return sum + item.total;
  }, 0);
  if (total < 0 || total > LIMIT) {
    return -1;
  }
  return total;
};

export const calculateTaxAmount = (subtotal: number, taxPercentage: number): number => {
  // if subtotal or subtotal * (taxPercentage / 100) is less than 0 or greater than LIMIT return -1
  // if taxPercentage greater than 100 or less than 0 return -1
  if (subtotal < 0 || taxPercentage < 0 || taxPercentage > 100||subtotal > LIMIT || subtotal * (taxPercentage / 100) > LIMIT) {
    return -1;
  }
  return subtotal * (taxPercentage / 100);
};

export const calculateTotal = (subtotal: number, taxAmount: number): number => {
  // if subtotal or taxAmount or (subtotal + taxAmount) is greater than LIMIT or less than 0 return -1
  if (subtotal < 0 || taxAmount < 0 || subtotal > LIMIT || taxAmount > LIMIT || subtotal + taxAmount > LIMIT) {
    return -1;
  }
  return subtotal + taxAmount;
};