import { numberToCurrencyWords } from '../../src/utils/numberToWord';

describe('Number to Word Conversion for INR', () => {
  interface TestCase {
    description: string;
    amount: number;
    expected?: string;
    expectError?: boolean;
  }

  const testCases: TestCase[] = [
    { description: 'Zero rupees', amount: 0, expected: 'Zero Rupees Only' },
    { description: 'Single rupee', amount: 1, expected: 'One Rupee Only' },
    { description: 'Single paise', amount: 0.01, expected: 'One Paise Only' },
    { description: 'Ten paise', amount: 0.1, expected: 'Ten Paise Only' },
    { description: 'Fifty Paise', amount: 0.5, expected: 'Fifty Paise Only' },
    { description: 'Rupees without paise', amount: 1234, expected: 'One Thousand Two Hundred and Thirty-Four Rupees Only' },
    { description: 'Rupees with paise', amount: 1234.56, expected: 'One Thousand Two Hundred Thirty-Four Rupees and Fifty-Six Paise Only' },
    { description: 'Crore and lakh', amount: 12345678.9, expected: 'One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred Seventy-Eight Rupees and Ninety Paise Only' },
    { description: 'Negative amount', amount: -250.5, expected: 'Negative value not supported' },
    { description: 'Large upper limit', amount: 100000000, expected: 'Ten Crore Rupees Only' },
    { description: 'Above limit throws error', amount: 100000001, expectError: true },
  ];

  testCases.forEach(({ description, amount, expected, expectError }) => {
    test(description, () => {
      if (expectError) {
        expect(() => numberToCurrencyWords(amount, 'INR')).toThrow('This function supports integer part up to 100,000,000 only.');
      } else {
        const result = numberToCurrencyWords(amount, 'INR');
        expect(result).toBe(expected);
      }
    });
  });
});


describe('Number to Word Conversion for USD', () => {
  interface TestCase {
    description: string;
    amount: number;
    expected?: string;
    expectError?: boolean;
  }

  const testCases: TestCase[] = [
    { description: 'Zero dollars', amount: 0, expected: 'Zero Dollars Only' },
    { description: 'Single dollar', amount: 1, expected: 'One Dollar Only' },
    { description: 'Single cent', amount: 0.01, expected: 'One Cent Only' },
    { description: 'Ten cents', amount: 0.1, expected: 'Ten Cents Only' },
    { description: 'Fifty cents', amount: 0.5, expected: 'Fifty Cents Only' },
    { description: 'Dollars without cents', amount: 1234, expected: 'One Thousand Two Hundred and Thirty-Four Dollars Only' },
    { description: 'Dollars with cents', amount: 1234.56, expected: 'One Thousand Two Hundred Thirty-Four Dollars and Fifty-Six Cents Only' },
    { description: 'Millions', amount: 45000000, expected: 'Forty-Five Million Dollars Only' },
    { description: 'Negative amount', amount: -250.5, expected: 'Negative value not supported' },
    { description: 'Large upper limit', amount: 100000000, expected: 'One Hundred Million Dollars Only' },
    { description: 'Above limit throws error', amount: 100000001, expectError: true },
  ];

  testCases.forEach(({ description, amount, expected, expectError }) => {
    test(description, () => {
      if (expectError) {
        expect(() => numberToCurrencyWords(amount, 'USD')).toThrow(
          'This function supports integer part up to 100,000,000 only.'
        );
      } else {
        const result = numberToCurrencyWords(amount, 'USD');
        expect(result).toBe(expected);
      }
    });
  });
});

describe('Edge Cases for Number to Word Conversion', () => {
  const edgeCases: { description: string; amount: number; currency: string }[] = [
    { description: 'Unsupported currency throws error', amount: 100, currency: 'XYZ' },
  ];

  edgeCases.forEach(({ description, amount, currency }) => {
    test(description, () => {
      expect(() => numberToCurrencyWords(amount, currency)).toThrow('Unsupported currency');
    });
  });
});
