import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import ResultCard from './ResultCard';
import EMIChart from './EMIChart';
import { Switch } from "@/components/ui/switch";
import { InfoIcon, DownloadIcon, Share2Icon, RotateCcw } from "lucide-react";
import { useTheme } from 'next-themes';

const EMICalculator = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [principal, setPrincipal] = useState<string>(() => 
    localStorage.getItem('emiPrincipal') || '500000'
  );
  const [interest, setInterest] = useState<string>(() => 
    localStorage.getItem('emiInterest') || '10.5'
  );
  const [tenure, setTenure] = useState<string>(() => 
    localStorage.getItem('emiTenure') || '2'
  );
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
    // Save to localStorage
    localStorage.setItem('emiPrincipal', principal);
    localStorage.setItem('emiInterest', interest);
    localStorage.setItem('emiTenure', tenure);
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

  const handlePrincipalSlider = (value: number[]) => {
    setPrincipal(value[0].toString());
  };

  const handleReset = () => {
    setPrincipal('500000');
    setInterest('10.5');
    setTenure('2');
    toast({
      title: "Reset Successful",
      description: "All values have been reset to default.",
    });
  };

  const handleSave = () => {
    const data = {
      principal,
      interest,
      tenure,
      emi,
      totalInterest,
      totalPayment,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emi-calculation.json';
    link.click();
    
    toast({
      title: "Download Complete",
      description: "Your EMI calculation details have been downloaded.",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'EMI Calculation Details',
      text: `Loan Amount: ₹${formatINR(principal)}\nInterest Rate: ${interest}%\nTenure: ${tenure} years\nMonthly EMI: ₹${Math.round(emi).toLocaleString('en-IN')}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Your EMI details have been shared.",
        });
      } else {
        await navigator.clipboard.writeText(shareData.text);
        toast({
          title: "Copied to Clipboard",
          description: "The EMI details have been copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share the EMI details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-emi-text">EMI Calculator</h2>
        <div className="flex items-center gap-4">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSave}>
            <DownloadIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="principal">Loan Amount (₹)</Label>
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
              onChange={handlePrincipalChange}
              className="text-lg"
              placeholder="Enter loan amount"
            />
            <Slider
              value={[parseFloat(principal)]}
              onValueChange={handlePrincipalSlider}
              max={10000000}
              step={10000}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="interest">Interest Rate (% per annum)</Label>
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
              onChange={(e) => setInterest(e.target.value)}
              className="text-lg"
              step="0.1"
              min="0"
              max="100"
              placeholder="Enter interest rate"
            />
            <Slider
              value={[parseFloat(interest)]}
              onValueChange={(value) => setInterest(value[0].toString())}
              max={30}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="tenure">Loan Tenure (Years)</Label>
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
              onChange={(e) => setTenure(e.target.value)}
              className="text-lg"
              min="0"
              step="0.5"
              placeholder="Enter loan tenure"
            />
            <Slider
              value={[parseFloat(tenure)]}
              onValueChange={(value) => setTenure(value[0].toString())}
              max={30}
              step={0.5}
              className="mt-2"
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