import { Currency } from "../constants/currencies";

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'
];
const TEENS = [
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
  'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];
const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function twoDigitToWords(n: number): string {
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens];
}

function threeDigitToWords(n: number): string {
  // n is 0..999
  if (n === 0) return 'Zero';
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) {
    parts.push(`${ONES[hundreds]} Hundred`);
  }
  if (rest) {
    // add a space between hundreds and the rest
    parts.push(twoDigitToWords(rest));
  }
  return parts.join(hundreds && rest ? ' ' : '');
}

function integerToWordsUSD(n: number): string {
  // n is 0..100,000,000
  if (n === 0) return 'Zero';
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000); // up to 100
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const hundreds = n % 1_000;

  if (millions) parts.push(`${threeDigitToWords(millions)} Million`);
  if (thousands) parts.push(`${threeDigitToWords(thousands)} Thousand`);
  if (hundreds) parts.push(`${threeDigitToWords(hundreds)}`);

  return parts.join(' ');
}

function integerToWordsINR(n: number): string {
  // Indian system: crore (1e7), lakh (1e5), thousand (1e3), hundred
  if (n === 0) return 'Zero';
  const parts: string[] = [];
  const crore = Math.floor(n / 10_000_000); // 1 crore = 10,000,000
  const lakh = Math.floor((n % 10_000_000) / 100_000);
  const thousand = Math.floor((n % 100_000) / 1_000);
  const hundreds = n % 1_000;

  if (crore) parts.push(`${threeDigitToWords(crore)} Crore`);
  if (lakh) parts.push(`${threeDigitToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigitToWords(thousand)} Thousand`);
  if (hundreds) parts.push(`${threeDigitToWords(hundreds)}`);

  return parts.join(' ');
}

/**
 * Convert a numeric amount to words for USD or INR up to 100,000,000 (one hundred million).
 *
 * Examples:
 *   numberToCurrencyWords(1234.56, 'USD') => "one thousand two hundred thirty-four dollars and fifty-six cents only"
 *   numberToCurrencyWords(12345678.9, 'INR') => "one crore twenty-three lakh forty-five thousand six hundred seventy-eight rupees and ninety paise only"
 */
export function numberToCurrencyWords(amount: number, currency: string): string {
  // if currency is not supported throw unsupported currency error
  // if amount is less than 0 return "Negative value not supported"
  if (!Currency[currency]) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  if (amount < 0) {
    return 'Negative value not supported'; 
  }

  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a finite number');
  }

  const absAmount = Math.abs(amount);

  // Use integer arithmetic for cents/paise to avoid float issues
  // totalSmallUnits = amount * 100 rounded to nearest integer
  const totalSmallUnits = Math.round(absAmount * 100); // paise or cents
  const integerPart = Math.floor(totalSmallUnits / 100);
  const fractionPart = totalSmallUnits % 100;

  if (integerPart > 100_000_000) {
    throw new Error('This function supports integer part up to 100,000,000 only.');
  }
  
  let integerWords: string;
  // Remember that 0.100 is 1 Rupee or 1 Dollar, not 10 paise or 10 cents
  // So if fractionPart is 100, we need to increment integerPart by 1 and set fractionPart to 0
  // Adjust for cases where fractionPart rounds to 100
  let adjustedIntegerPart = integerPart;
  let adjustedFractionPart = fractionPart;

  if (fractionPart === 100) {
    adjustedIntegerPart += 1;
    adjustedFractionPart = 0;
  }

  if (currency === 'USD') {
    integerWords = integerToWordsUSD(adjustedIntegerPart);
  } else {
    integerWords = integerToWordsINR(adjustedIntegerPart);
  }

  const fracWords = threeDigitToWords(adjustedFractionPart);



  // currency unit names
  const names = {
    USD: {
      majorSingular: 'Dollar',
      majorPlural: 'Dollars',
      minorSingular: 'Cent',
      minorPlural: 'Cents'
    },
    INR: {
      majorSingular: 'Rupee',
      majorPlural: 'Rupees',
      minorSingular: 'Paise', // paise is commonly used as plural same form
      minorPlural: 'Paise'
    }
  } as const;

  const cur = names[currency as keyof typeof names] || names['INR'];

  const majorUnit = adjustedIntegerPart === 1 ? cur.majorSingular : cur.majorPlural;
  const minorUnit = adjustedFractionPart === 1 ? cur.minorSingular : cur.minorPlural;

  const parts: string[] = [];
  // if integerPart is 0 and fractionPart is 0, we say "Zero Rupees Only" or "Zero Dollars Only"
  // if integerPart is 0, and fractionPart > 0, we say "X Paise Only" or "X Cents Only"
  // if integerPart > 0 and fractionPart is 0, we say "X Rupees Only" or "X Dollars Only"
  // if integerPart > 0 and fractionPart > 0, we say "X Rupees and Y Paise Only" or "X Dollars and Y Cents Only"
  // Handle zero case
  if (adjustedIntegerPart === 0 && adjustedFractionPart === 0) {
    parts.push(`Zero ${majorUnit}`);
    parts.push('Only');
    return parts.join(' ');
  }

  // Handle non-zero cases
  if (adjustedIntegerPart === 0 && adjustedFractionPart > 0) {
    parts.push(`${fracWords} ${minorUnit}`);
    parts.push('Only');
    // return parts.join(' ');
  } else if (adjustedIntegerPart > 0 && adjustedFractionPart === 0) {
    // 1234; "One Thousand Two Hundred and Thirty-Four Rupees Only" handle the 'and' before last part if hundreds is present
    if (adjustedIntegerPart % 1000 !== adjustedIntegerPart && (adjustedIntegerPart % 100) < 100 && (adjustedIntegerPart % 100) > 0) {
      // there are thousands and hundreds, and a non-zero tens/ones part
      const lastSpaceIndex = integerWords.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        integerWords = integerWords.slice(0, lastSpaceIndex) + ' and' + integerWords.slice(lastSpaceIndex);
      }
    }
    parts.push(`${integerWords} ${majorUnit}`);
    parts.push('Only');
    // return parts.join(' ');
  } else if (adjustedIntegerPart > 0 && adjustedFractionPart > 0) {
    parts.push(`${integerWords} ${majorUnit}`);
    parts.push('and');
    parts.push(`${fracWords} ${minorUnit}`);
    parts.push('Only');
    // return parts.join(' ');
  }

  // parts.push('Only');

  // join with single spaces; normalize multiple spaces from potential joins
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}