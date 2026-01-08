import { Client, Invoice, Business } from "../constants/types";
export const validateInvoice = (invoice: Invoice, client: Client, business: Business): string[] => {
  const errors: string[] = [];
  if (!business.displayName) {
    errors.push('Business name is required');
  }
  
  if (!client.displayName) {
    errors.push('Client is required');
  }

  if (!client.email) {
    errors.push('Client email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (client.email && !emailRegex.test(client.email)) {
    errors.push('Client email is invalid');
  }
  
    if (business.email && !emailRegex.test(business.email)) {
    errors.push('Business email is invalid');
  }

  if (!invoice.invoiceNumber) {
    errors.push('Invoice number is required');
  }
  
  if (!invoice.invoiceDate) {
    errors.push('Invoice date is required');
  }
  
  if (!invoice.dueDate) {
    errors.push('Due date is required');
  }

  if(invoice.dueDate < invoice.invoiceDate) {
    errors.push('Due date should be after Invoice date');
  }

  if (invoice.lineItems.length === 0) {
    errors.push('At least one line item is required');
  }
  
  invoice.lineItems.forEach((item, index) => {
    if (!item.description.trim()) {
      errors.push(`Line item ${index + 1}: Description is required`);
    }
    if (item.quantity <= 0 || item.quantity > 100_000_000) {
      errors.push(`Line item ${index + 1}: Quantity must be greater than 0 and less than or equal to 100000000`);
    }
    if (item.unitPrice <= 0 || item.unitPrice > 100_000_000) {
      errors.push(`Line item ${index + 1}: Unit price must be greater than 0 and less than or equal to 100000000`);
    }
  });
  
  return errors;
};
