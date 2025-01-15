import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResultCard from './ResultCard';
import EMIChart from './EMIChart';

const EMICalculator = () => {
  const [principal, setPrincipal] = useState<string>('500000');
  const [interest, setInterest] = useState<string>('10.5');
  const [tenure, setTenure] = useState<string>('2');
  const [emi, setEMI] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest) / 12 / 100;
    const n = parseFloat(tenure) * 12;
    
    if (p && r && n) {
      const emiAmount = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalPay = emiAmount * n;
      
      setEMI(emiAmount);
      setTotalPayment(totalPay);
      setTotalInterest(totalPay - p);
    }
  };

  useEffect(() => {
    calculateEMI();
  }, [principal, interest, tenure]);

  const formatINR = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(value)) {
      setPrincipal(value);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-emi-text text-center">EMI Calculator</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Loan Amount (₹)</Label>
            <Input
              id="principal"
              value={formatINR(principal)}
              onChange={handlePrincipalChange}
              className="text-lg"
              placeholder="Enter loan amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest">Interest Rate (% per annum)</Label>
            <Input
              id="interest"
              type="number"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="text-lg"
              step="0.1"
              min="0"
              max="100"
              placeholder="Enter interest rate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenure">Loan Tenure (Years)</Label>
            <Input
              id="tenure"
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="text-lg"
              min="0"
              step="0.5"
              placeholder="Enter loan tenure"
            />
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <ResultCard emi={emi} totalInterest={totalInterest} totalPayment={totalPayment} />
        <EMIChart principal={parseFloat(principal)} totalInterest={totalInterest} />
      </div>
    </div>
  );
};

export default EMICalculator;