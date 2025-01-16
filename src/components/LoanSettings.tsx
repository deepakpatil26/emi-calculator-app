import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LOAN_TYPES,
  CURRENCIES,
  type LoanType,
  type Currency,
} from "@/types/calculator";

interface LoanSettingsProps {
  selectedLoanType: string;
  onLoanTypeChange: (type: string) => void;
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const LoanSettings = ({
  selectedLoanType,
  onLoanTypeChange,
  selectedCurrency,
  onCurrencyChange,
}: LoanSettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Loan Type</label>
        <Select
          value={selectedLoanType}
          onValueChange={(value) => onLoanTypeChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select loan type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LOAN_TYPES).map(([key, loan]) => (
              <SelectItem key={key} value={key}>
                {loan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Currency</label>
        <Select
          value={selectedCurrency.code}
          onValueChange={(value) => {
            const currency = CURRENCIES.find((c) => c.code === value);
            if (currency) onCurrencyChange(currency);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.symbol} - {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LoanSettings;
