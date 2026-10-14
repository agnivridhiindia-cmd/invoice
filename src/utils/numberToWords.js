/**
 * Converts Indian currency numbers to words in UPPERCASE
 * e.g. 11800 -> ELEVEN THOUSAND EIGHT HUNDRED RUPEES ONLY
 */
export function numberToWordsINR(amount) {
  const num = Math.round(Number(amount) || 0);
  if (num === 0) return "ZERO RUPEES ONLY";

  const a = [
    "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
    "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN",
    "SEVENTEEN", "EIGHTEEN", "NINETEEN"
  ];
  const b = [
    "", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
  ];

  function convertTwoDigits(n) {
    if (n < 20) return a[n];
    const tens = b[Math.floor(n / 10)];
    const ones = a[n % 10];
    return ones ? `${tens} ${ones}` : tens;
  }

  function convertThreeDigits(n) {
    let str = "";
    if (Math.floor(n / 100) > 0) {
      str += a[Math.floor(n / 100)] + " HUNDRED ";
    }
    const rem = n % 100;
    if (rem > 0) {
      str += convertTwoDigits(rem);
    }
    return str.trim();
  }

  let words = "";

  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  const hundred = rem;

  if (crore > 0) {
    words += convertTwoDigits(crore) + " CRORE ";
  }
  if (lakh > 0) {
    words += convertTwoDigits(lakh) + " LAKH ";
  }
  if (thousand > 0) {
    words += convertTwoDigits(thousand) + " THOUSAND ";
  }
  if (hundred > 0) {
    words += convertThreeDigits(hundred) + " ";
  }

  return words.trim() + " RUPEES ONLY";
}

export function formatAmount(val) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val || 0);
}

export function formatIntAmount(val) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(val || 0);
}
