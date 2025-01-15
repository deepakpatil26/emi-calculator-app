import React from 'react';
import { Card } from "@/components/ui/card";

interface ResultCardProps {
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

const ResultCard = ({ emi, totalInterest, totalPayment }: ResultCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-6 space-y-4 bg-emi-secondary">
      <h3 className="text-xl font-semibold text-emi-text">Payment Details</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Monthly EMI:</span>
          <span className="text-lg font-semibold text-emi-primary">
            {formatCurrency(emi)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Interest:</span>
          <span className="text-lg font-semibold text-emi-primary">
            {formatCurrency(totalInterest)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Payment:</span>
          <span className="text-lg font-semibold text-emi-primary">
            {formatCurrency(totalPayment)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;