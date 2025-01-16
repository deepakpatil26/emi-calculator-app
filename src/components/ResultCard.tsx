import React from 'react';
import { Card } from "@/components/ui/card";
import { type Currency } from '@/types/calculator';

interface ResultCardProps {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  currency: Currency;
}

const ResultCard = ({ emi, totalInterest, totalPayment, currency }: ResultCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Payment Details</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Monthly EMI:</span>
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(emi)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Interest:</span>
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(totalInterest)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Payment:</span>
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(totalPayment)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;