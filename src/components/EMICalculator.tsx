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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import ResultCard from './ResultCard';
import EMIChart from './EMIChart';
import LoanSettings from './LoanSettings';
import { Switch } from "@/components/ui/switch";
import { InfoIcon, DownloadIcon, Share2Icon, RotateCcw, Link2Icon, Copy, Mail } from "lucide-react";
import { useTheme } from 'next-themes';
import jsPDF from 'jspdf';
import { LOAN_TYPES, CURRENCIES, type Currency } from '@/types/calculator';

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
  const [loanType, setLoanType] = useState<string>(() =>
    localStorage.getItem('emiLoanType') || 'personal'
  );
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('emiCurrency');
    return saved ? JSON.parse(saved) : CURRENCIES[0];
  });
  const [emi, setEMI] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoanTypeChange = (type: string) => {
    setLoanType(type);
    const loanTypeInfo = LOAN_TYPES[type];
    setInterest(loanTypeInfo.defaultRate.toString());
    localStorage.setItem('emiLoanType', type);
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('emiCurrency', JSON.stringify(newCurrency));
  };

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

  const handleSave = (format: 'pdf' | 'csv') => {
    if (format === 'pdf') {
      const pdf = new jsPDF();
      pdf.text('EMI Calculation Details', 20, 20);
      pdf.text(`Loan Amount: ${currency.symbol}${formatINR(principal)}`, 20, 40);
      pdf.text(`Interest Rate: ${interest}%`, 20, 50);
      pdf.text(`Tenure: ${tenure} years`, 20, 60);
      pdf.text(`Monthly EMI: ${currency.symbol}${Math.round(emi).toLocaleString('en-IN')}`, 20, 70);
      pdf.text(`Total Interest: ${currency.symbol}${Math.round(totalInterest).toLocaleString('en-IN')}`, 20, 80);
      pdf.text(`Total Payment: ${currency.symbol}${Math.round(totalPayment).toLocaleString('en-IN')}`, 20, 90);
      pdf.save('emi-calculation.pdf');
    } else {
      const csvContent = `Loan Amount,Interest Rate,Tenure,Monthly EMI,Total Interest,Total Payment\n${currency.symbol}${formatINR(principal)},${interest}%,${tenure},${currency.symbol}${Math.round(emi).toLocaleString('en-IN')},${currency.symbol}${Math.round(totalInterest).toLocaleString('en-IN')},${currency.symbol}${Math.round(totalPayment).toLocaleString('en-IN')}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'emi-calculation.csv';
      link.click();
    }
    
    toast({
      title: "Download Complete",
      description: `Your EMI calculation details have been downloaded as ${format.toUpperCase()}.`,
    });
  };

  const handleShare = async (method: 'link' | 'copy' | 'email') => {
    const shareData = {
      title: 'EMI Calculation Details',
      text: `Loan Amount: ${currency.symbol}${formatINR(principal)}\nInterest Rate: ${interest}%\nTenure: ${tenure} years\nMonthly EMI: ${currency.symbol}${Math.round(emi).toLocaleString('en-IN')}`,
      url: window.location.href
    };

    try {
      switch (method) {
        case 'link':
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            toast({
              title: "Shared Successfully",
              description: "Your EMI details have been shared.",
            });
          } else {
            throw new Error("Web Share API not supported");
          }
          break;
        
        case 'copy':
          await navigator.clipboard.writeText(
            `EMI Calculator Results:\n\n${shareData.text}\n\nCalculate your EMI at: ${shareData.url}`
          );
          toast({
            title: "Copied to Clipboard",
            description: "The EMI details and calculator link have been copied to your clipboard.",
          });
          break;
        
        case 'email':
          const emailBody = encodeURIComponent(`${shareData.text}\n\nCalculate your EMI at: ${shareData.url}`);
          window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${emailBody}`;
          toast({
            title: "Email Client Opened",
            description: "Share the EMI details via email.",
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share the EMI details. Please try another sharing method.",
        variant: "destructive",
      });
    }
  };

  if (!mounted) {
    return null;
  }

  const selectedLoanType = LOAN_TYPES[loanType];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">EMI Calculator</h2>
          <div className="flex items-center gap-4">
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSave('pdf')}>
                  Save as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSave('csv')}>
                  Save as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2Icon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleShare('link')}>
                  <Link2Icon className="h-4 w-4 mr-2" />
                  Share link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to clipboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Share via email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="pt-16">
        <Card className="p-6 space-y-6">
          <LoanSettings
            selectedLoanType={loanType}
            onLoanTypeChange={handleLoanTypeChange}
            selectedCurrency={currency}
            onCurrencyChange={handleCurrencyChange}
          />

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
                onChange={handlePrincipalChange}
                className="text-lg"
                placeholder="Enter loan amount"
              />
              <Slider
                value={[parseFloat(principal)]}
                onValueChange={handlePrincipalSlider}
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

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ResultCard 
            emi={emi} 
            totalInterest={totalInterest} 
            totalPayment={totalPayment} 
            currency={currency}
          />
          <EMIChart principal={parseFloat(principal)} totalInterest={totalInterest} />
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
