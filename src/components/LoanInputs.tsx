import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { type Currency } from '@/types/calculator';
import { LOAN_TYPES } from '@/types/calculator';

interface LoanInputsProps {
  principal: string;
  interest: string;
  tenure: string;
  currency: Currency;
  loanType: string;
  onPrincipalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrincipalSlider: (value: number[]) => void;
  onInterestChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTenureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoanInputs = ({
  principal,
  interest,
  tenure,
  currency,
  loanType,
  onPrincipalChange,
  onPrincipalSlider,
  onInterestChange,
  onTenureChange,
}: LoanInputsProps) => {
  const formatINR = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const selectedLoanType = LOAN_TYPES[loanType];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="principal" className="text-foreground">Loan Amount ({currency.symbol})</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter the total loan amount you wish to borrow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="principal"
          value={formatINR(principal)}
          onChange={onPrincipalChange}
          className="text-lg"
          placeholder="Enter loan amount"
        />
        <Slider
          value={[parseFloat(principal)]}
          onValueChange={onPrincipalSlider}
          max={selectedLoanType.maxAmount}
          step={10000}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="interest" className="text-foreground">Interest Rate (% per annum)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Annual interest rate charged on the loan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="interest"
          type="number"
          value={interest}
          onChange={onInterestChange}
          className="text-lg"
          step="0.1"
          min="0"
          max="100"
          placeholder="Enter interest rate"
        />
        <Slider
          value={[parseFloat(interest)]}
          onValueChange={(value) => onInterestChange({ target: { value: value[0].toString() } } as React.ChangeEvent<HTMLInputElement>)}
          max={30}
          step={0.1}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="tenure" className="text-foreground">Loan Tenure (Years)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Duration of the loan in years</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="tenure"
          type="number"
          value={tenure}
          onChange={onTenureChange}
          className="text-lg"
          min="0"
          step="0.5"
          placeholder="Enter loan tenure"
        />
        <Slider
          value={[parseFloat(tenure)]}
          onValueChange={(value) => onTenureChange({ target: { value: value[0].toString() } } as React.ChangeEvent<HTMLInputElement>)}
          max={30}
          step={0.5}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default LoanInputs;