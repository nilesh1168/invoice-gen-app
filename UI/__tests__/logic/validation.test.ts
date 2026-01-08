import { validateInvoice } from '../../src/utils/validation';
import { Business, Client, Invoice } from '../../src/constants/types';

describe('Invoice validation', () => {
  const validInvoice: Invoice = {
    id: '1',
    invoiceNumber: 'INV-001',
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

  const validClient: Client = {
    uid: 'client1',
    displayName: 'John Doe',
    email: 'john@example.com',
  };

  const validBusiness: Business = {
    uid: 'biz1',
    displayName: 'My Business',
    email: 'business@example.com',
    businessLogo: '',
  };

  interface TestCase {
    description: string;
    invoice: Invoice;
    client: Client;
    business: Business;
    expectedErrors?: string[];
    expectLength?: number;
  }

  const testCases: TestCase[] = [
    {
      description: 'All fields in Invoice are correct and valid along with proper line items',
      invoice: validInvoice,
      client: validClient,
      business: validBusiness,
      expectLength: 0,
    },
    {
      description: 'All fields in Invoice are blank',
      invoice: {
        id: '',
        invoiceNumber: '',
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
      client: { uid: '', displayName: '', email: '' },
      business: { uid: '', displayName: '', email: '', businessLogo: '' },
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
      invoice: { ...validInvoice },
      client: { ...validClient, email: 'invalid-email' },
      business: { ...validBusiness, email: 'also-invalid-email' },
      expectedErrors: ['Client email is invalid', 'Business email is invalid'],
    },
    {
      description: 'No Line Items provided',
      invoice: { ...validInvoice, lineItems: [] },
      client: validClient,
      business: validBusiness,
      expectedErrors: ['At least one line item is required'],
    },
    {
      description: 'Line Items provided but description is empty',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], description: '' }] },
      client: validClient,
      business: validBusiness,
      expectedErrors: ['Line item 1: Description is required'],
    },
    {
      description: 'Line Items provided but unit price is zero',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: 0 }] },
      client: validClient,
      business: validBusiness,
      expectedErrors: ['Line item 1: Unit price must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but quantity is zero',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: 0 }] },
      client: validClient,
      business: validBusiness,
      expectedErrors: ['Line item 1: Quantity must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but unit price is negative',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: -10 }] },
      client: validClient,
      business: validBusiness,
      expectedErrors: ['Line item 1: Unit price must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but quantity is negative',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: -5 }] },
      client: validClient,
      business: validBusiness,
      expectedErrors: ['Line item 1: Quantity must be greater than 0 and less than or equal to 100000000'],
    },
    {
      description: 'Line Items provided but quantity is decimal',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: 2.5 }] },
      client: validClient,
      business: validBusiness,
      expectLength: 0,
    },
    {
      description: 'Line Items provided but unit price is decimal',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: 19.99 }] },
      client: validClient,
      business: validBusiness,
      expectLength: 0,
    },
    {
      description: 'Line Items provided but unit price is large (100,000,000 + 1)',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], unitPrice: 100_000_001 }] },
      client: validClient,
      business: validBusiness,
      expectLength: 1,
    },
    {
      description: 'Line Items provided but quantity is large (1,000,000,000 + 1)',
      invoice: { ...validInvoice, lineItems: [{ ...validInvoice.lineItems[0], quantity: 1_000_000_001 }] },
      client: validClient,
      business: validBusiness,
      expectLength: 1,
    },
  ];

  testCases.forEach(({ description, invoice, client, business, expectedErrors, expectLength }) => {
    test(description, () => {
      const errors = validateInvoice(invoice, client, business);
      if (expectedErrors) {
        expectedErrors.forEach(err => expect(errors).toContain(err));
      }
      if (expectLength !== undefined) {
        expect(errors).toHaveLength(expectLength);
      }
    });
  });
});