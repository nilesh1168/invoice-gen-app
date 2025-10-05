import { numberToCurrencyWords } from '../src/utils/numberToWord';

describe('Number to Word Conversion for INR', () => {
  interface TestCase {
    description: string;
    amount: number;
    expected?: string;
    expectError?: boolean;
  }

  const testCases: TestCase[] = [
    { description: 'Zero rupees', amount: 0, expected: 'zero rupees only' },
    { description: 'Single rupee', amount: 1, expected: 'one rupee only' },
    { description: 'Single paise', amount: 0.01, expected: 'one paise only' },
    { description: 'Ten paise', amount: 0.1, expected: 'one paise only' },
    { description: 'Rupees with paise', amount: 1234.56, expected: 'one thousand two hundred thirty-four rupees and fifty-six paise only' },
    { description: 'Crore and lakh', amount: 12345678.9, expected: 'one crore twenty-three lakh forty-five thousand six hundred seventy-eight rupees and ninety paise only' },
    { description: 'Negative amount', amount: -250.5, expected: 'Negative value not supported' },
    { description: 'Large upper limit', amount: 100000000, expected: 'ten crore rupees only' },
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
    { description: 'Zero dollars', amount: 0, expected: 'zero dollars only' },
    { description: 'Single dollar', amount: 1, expected: 'one dollar only' },
    { description: 'Single cent', amount: 0.01, expected: 'one cent only' },
    { description: 'Ten cents', amount: 0.1, expected: 'ten cents only' },
    { description: 'Dollars with cents', amount: 1234.56, expected: 'one thousand two hundred thirty-four dollars and fifty-six cents only' },
    { description: 'Millions', amount: 45000000, expected: 'forty-five million dollars only' },
    { description: 'Negative amount', amount: -250.5, expected: 'Negative value not supported' },
    { description: 'Large upper limit', amount: 100000000, expected: 'one hundred million dollars only' },
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
