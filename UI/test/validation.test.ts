import { validateInvoice } from '../src/utils/validation';
import { Invoice } from '../src/constants/types';

describe('Invoice validation', () => {
  const validInvoice: Invoice = {
    id: '1',
    invoiceNumber: 'INV-001',
    client: { name: 'John Doe', email: 'john@example.com', address: '123 Street' },
    businessInfo: { name: 'My Business', address: '456 Avenue', phone: '1234567890' },
    invoiceDate: new Date('2023-01-01'),
    dueDate: new Date('2023-01-10'),
    lineItems: [{ id: 'li1', description: 'Service A', quantity: 2, unitPrice: 100, total: 200 }],
    taxPercentage: 10,
    notes: 'Thank you!',
    subtotal: 200,
    taxAmount: 20,
    total: 220,
    currency: 'USD',
  };

  interface TestCase {
    description: string;
    invoice: Invoice;
    expectedErrors?: string[];
    expectLength?: number;
  }

  const testCases: TestCase[] = [
    {
      description: 'All fields in Invoice are correct and valid along with proper line items',
      invoice: validInvoice,
      expectLength: 0,
    },
    {
      description: 'All fields in Invoice are blank',
      invoice: {
        id: '',
        invoiceNumber: '',
        client: { name: '', email: '' },
        businessInfo: { name: '', address: '' },
        invoiceDate: null as any,
        dueDate: null as any,
        lineItems: [],
        taxPercentage: 0,
        notes: '',
        subtotal: 0,
        taxAmount: 0,
        total: 0,
        currency: '',
      },
      expectedErrors: [
        'Business name is required',
        'Client is required',
        'Client email is required',
        'Invoice number is required',
        'Invoice date is required',
        'Due date is required',
        'At least one line item is required',
      ],
    },
    {
      description: 'Email is invalid',
      invoice: { ...validInvoice, client: { ...validInvoice.client!, email: 'invalid-email' } },
      expectedErrors: ['Client email is invalid'],
    },
    {
      description: 'No Line Items provided',
      invoice: { ...validInvoice, lineItems: [] },
      expectedErrors: ['At least one line item is required'],
    },
    {
      description: 'Line Items provided but description is empty',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], description: '' }] },
      expectedErrors: ['Line item 1: Description is required'],
    },
    {
      description: 'Line Items provided but unit price is zero',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: 0 }] },
      expectedErrors: ['Line item 1: Unit price must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but quantity is zero',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: 0 }] },
      expectedErrors: ['Line item 1: Quantity must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but unit price is negative',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: -10 }] },
      expectedErrors: ['Line item 1: Unit price must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but quantity is negative',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: -5 }] },
      expectedErrors: ['Line item 1: Quantity must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but quantity is decimal',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: 2.5 }] },
      expectLength: 0,
    },
    {
      description: 'Line Items provided but unit price is decimal',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: 19.99 }] },
      expectLength: 0,
    },
    {
      description: 'Line Items provided but unit price is large (100,000,000 + 1)',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: 100_000_001 }] },
      expectLength: 1,
    },
    {
      description: 'Line Items provided but quantity is large (1,000,000,000 + 1)',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: 1_000_000_001 }] },
      expectLength: 1,
    },
  ];

  testCases.forEach(({ description, invoice, expectedErrors, expectLength }) => {
    test(description, () => {
      const errors = validateInvoice(invoice);
      if (expectedErrors) {
        expectedErrors.forEach(err => expect(errors).toContain(err));
      }
      if (expectLength !== undefined) {
        expect(errors).toHaveLength(expectLength);
      }
    });
  });
});