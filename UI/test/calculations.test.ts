import { calculateLineItemTotal, calculateSubtotal, calculateTaxAmount, calculateTotal } from "../src/utils/calculations";
import { LineItem } from "../src/constants/types";

describe('Line Item Calculation', () => {
  interface TestCase {
    description: string;
    quantity: number;
    unitPrice: number;
    expected: number;
  }

  const testCases: TestCase[] = [
    { description: 'zero quantity', quantity: 0, unitPrice: 100, expected: 0 },
    { description: 'zero unit price', quantity: 5, unitPrice: 0, expected: 0 },
    { description: 'normal case', quantity: 5, unitPrice: 20, expected: 100 },
    { description: 'decimal unit price', quantity: 5, unitPrice: 20.5, expected: 102.5 },
    { description: 'negative quantity', quantity: -3, unitPrice: 50, expected: -1 }, // Invalid case
    { description: 'negative unit price', quantity: 3, unitPrice: -50, expected: -1 }, // Invalid case
    { description: 'large unit price (100,000,000 + 1)', quantity: 1, unitPrice: 100_000_001, expected: -1 }, // Invalid case
    { description: 'large quantity (1,000,000,000 + 1)', quantity: 100_000_001, unitPrice: 1, expected: -1 }, // Invalid case
  ];

  testCases.forEach(({ description, quantity, unitPrice, expected }) => {
    test(description, () => {
      expect(calculateLineItemTotal(quantity, unitPrice)).toBe(expected);
    });
  });
});

describe('Line Items Subtotal Calculations', () => {
  interface TestCase {
    description: string;
    items: LineItem[];
    expected: number;
  }

  const testCases: TestCase[] = [
    {
      description: 'empty line items',
      items: [],
      expected: 0,
    },
    {
      description: 'single item',
      items: [
        { id: '1', description: 'Pen', quantity: 2, unitPrice: 10, total: 20 }
      ],
      expected: 20,
    },
    {
      description: 'multiple items',
      items: [
        { id: '1', description: 'Pen', quantity: 2, unitPrice: 10, total: 20 },
        { id: '2', description: 'Notebook', quantity: 1, unitPrice: 50, total: 50 },
        { id: '3', description: 'Pencil', quantity: 5, unitPrice: 2, total: 10 },
      ],
      expected: 80,
    },
    {
      description: 'negative total',
      items: [
        { id: '1', description: 'Refund', quantity: 1, unitPrice: -10, total: -10 },
        { id: '2', description: 'Notebook', quantity: 2, unitPrice: 20, total: 40 },
      ],
      expected: 40, // Negative totals treated as 0
    },
    {
      description: 'mixed zero totals',
      items: [
        { id: '1', description: 'Free Item', quantity: 1, unitPrice: 0, total: 0 },
        { id: '2', description: 'Pen', quantity: 2, unitPrice: 15, total: 30 },
        { id: '3', description: 'Book', quantity: 0, unitPrice: 50, total: 0 },
      ],
      expected: 30,
    },
    {
      description: 'large total item',
      items: [
        { id: '1', description: 'Expensive Item', quantity: 1, unitPrice: 100_000_001, total: 100_000_001 },
        { id: '2', description: 'Pen', quantity: 2, unitPrice: 15, total: 30 },
      ],
      expected: -1, // Exceeds limit
    },
        {
      description: 'total in fractions',
      items: [
        { id: '1', description: 'Expensive Item', quantity: 1, unitPrice: 0.5, total: 0.5 },
        { id: '2', description: 'Pen', quantity: 1, unitPrice: 0.5, total: 0.5 },
      ],
      expected: 1,
    },
  ];

  testCases.forEach(({ description, items, expected }) => {
    test(description, () => {
      expect(calculateSubtotal(items)).toBe(expected);
    });
  });
});

describe('Tax Amount Calculations', () => {
  interface TestCase {
    description: string;
    subtotal: number;
    taxPercentage: number;
    expected: number;
    useCloseTo?: boolean; // optional for floating-point comparisons
  }

  const testCases: TestCase[] = [
    { description: 'zero tax percentage', subtotal: 1000, taxPercentage: 0, expected: 0 },
    { description: 'normal tax percentage', subtotal: 1000, taxPercentage: 10, expected: 100 },
    { description: 'negative tax percentage', subtotal: 1000, taxPercentage: -5, expected: -1 }, // Invalid case
    { description: 'decimal tax percentage', subtotal: 200, taxPercentage: 7.5, expected: 15 },
    { description: 'tax percentage over 100', subtotal: 1000, taxPercentage: 150, expected: -1 }, // Invalid case
    { description: 'zero subtotal', subtotal: 0, taxPercentage: 18, expected: 0 },
    { description: 'negative subtotal', subtotal: -500, taxPercentage: 10, expected: -1 },
    { description: 'decimal subtotal', subtotal: 99.99, taxPercentage: 5, expected: 5, useCloseTo: true },
    { description: 'large subtotal (100,000,000 + 1)', subtotal: 100_000_001, taxPercentage: 18, expected: -1 }, // Invalid case
  ];

  testCases.forEach(({ description, subtotal, taxPercentage, expected, useCloseTo }) => {
    test(description, () => {
      const result = calculateTaxAmount(subtotal, taxPercentage);
      if (useCloseTo) {
        expect(result).toBeCloseTo(expected, 2);
      } else {
        expect(result).toBe(expected);
      }
    });
  });
});

describe('Total Calculations', () => {
  interface TestCase {
    description: string;
    subtotal: number;
    taxAmount: number;
    expected: number;
    useCloseTo?: boolean;
  }

  const testCases: TestCase[] = [
    { description: 'subtotal with zero', subtotal: 0, taxAmount: 50, expected: 50 },
    { description: 'subtotal with normal', subtotal: 100, taxAmount: 20, expected: 120 },
    { description: 'subtotal with negative', subtotal: -100, taxAmount: 20, expected: -1 }, // Invalid case
    { description: 'subtotal with decimal', subtotal: 99.99, taxAmount: 0.01, expected: 100, useCloseTo: true },
    { description: 'subtotal large (100,000,000 + 1)', subtotal: 100_000_001, taxAmount: 100, expected: -1 }, // Invalid case

    { description: 'tax amount zero', subtotal: 500, taxAmount: 0, expected: 500 },
    { description: 'tax amount negative', subtotal: 500, taxAmount: -50, expected: -1 },
    { description: 'tax amount decimal', subtotal: 200, taxAmount: 19.99, expected: 219.99, useCloseTo: true },
    { description: 'tax amount normal', subtotal: 1000, taxAmount: 180, expected: 1180 },
    { description: 'tax amount large (100,000,000 + 1)', subtotal: 500, taxAmount: 100_000_001, expected: -1 }, // Invalid case
  ];

  testCases.forEach(({ description, subtotal, taxAmount, expected, useCloseTo }) => {
    test(description, () => {
      const result = calculateTotal(subtotal, taxAmount);
      if (useCloseTo) {
        expect(result).toBeCloseTo(expected, 2);
      } else {
        expect(result).toBe(expected);
      }
    });
  });
});