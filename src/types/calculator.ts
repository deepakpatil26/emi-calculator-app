export type LoanType = {
  name: string;
  defaultRate: number;
  maxAmount: number;
  maxTenure: number;
};

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const LOAN_TYPES: Record<string, LoanType> = {
  personal: {
    name: "Personal Loan",
    defaultRate: 12.5,
    maxAmount: 2000000,
    maxTenure: 5,
  },
  home: {
    name: "Home Loan",
    defaultRate: 8.5,
    maxAmount: 10000000,
    maxTenure: 30,
  },
  car: {
    name: "Car Loan",
    defaultRate: 9.5,
    maxAmount: 3000000,
    maxTenure: 7,
  },
};

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];
