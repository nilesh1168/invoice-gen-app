import { Invoice } from "../constants/types";
export const validateInvoice = (invoice: Invoice): string[] => {
  const errors: string[] = [];
  if (!invoice.businessInfo.name) {
    errors.push('Business name is required');
  }
  
  if (!invoice.client?.name) {
    errors.push('Client is required');
  }

  if (!invoice.client?.email) {
    errors.push('Client email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (invoice.client?.email && !emailRegex.test(invoice.client.email)) {
    errors.push('Client email is invalid');
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
    if (item.quantity <= 0 || item.quantity > 1000000000) {
      errors.push(`Line item ${index + 1}: Quantity must be greater than 0 and less than or equal to 1000000000`);
    }
    if (item.unitPrice <= 0 || item.unitPrice > 1000000000) {
      errors.push(`Line item ${index + 1}: Unit price must be greater than 0 and less than or equal to 1000000000`);
    }
  });
  
  return errors;
};
