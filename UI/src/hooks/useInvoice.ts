import { useState, useCallback } from 'react';
import { Invoice, LineItem} from '../constants/types';
import { calculateLineItemTotal, calculateSubtotal, calculateTaxAmount, calculateTotal } from '../utils/calculations';

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    id: Date.now().toString(),
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    lineItems: [],
    taxPercentage: 0,
    notes: '',
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    currency: 'INR',
  });

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...updates }));
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
  };

  const removeLineItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }));
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          updatedItem.total = calculateLineItemTotal(updatedItem.quantity, updatedItem.unitPrice);
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const recalculateInvoice = useCallback(() => {
    // Derive totals from the latest state to avoid stale closures
    setInvoice(prev => {
      const subtotal = calculateSubtotal(prev.lineItems);
      const taxAmount = calculateTaxAmount(subtotal, prev.taxPercentage);
      const total = calculateTotal(subtotal, taxAmount);

      return {
        ...prev,
        subtotal,
        taxAmount,
        total,
      };
    });
  }, []);

  const resetInvoice = () => {
    setInvoice({
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lineItems: [],
      taxPercentage: 0,
      notes: '',
      subtotal: 0,
      taxAmount: 0,
      total: 0,
      currency: 'INR',
    });
  };

  return {
    invoice,
    updateInvoice,
    addLineItem,
    removeLineItem,
    updateLineItem,
    recalculateInvoice,
    resetInvoice,
  };
};
