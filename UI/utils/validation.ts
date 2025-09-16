import { Invoice } from "../constants/types";
export const validateInvoice = (invoice: Invoice): string[] => {
  const errors: string[] = [];
  
  if (!invoice.client) {
    errors.push('Client is required');
  }
  
  if (!invoice.businessInfo.name) {
    errors.push('Business name is required');
  }
  
  if (invoice.lineItems.length === 0) {
    errors.push('At least one line item is required');
  }
  
  invoice.lineItems.forEach((item, index) => {
    if (!item.description.trim()) {
      errors.push(`Line item ${index + 1}: Description is required`);
    }
    if (item.quantity <= 0) {
      errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
    }
    if (item.unitPrice <= 0) {
      errors.push(`Line item ${index + 1}: Unit price must be greater than 0`);
    }
  });
  
  return errors;
};
