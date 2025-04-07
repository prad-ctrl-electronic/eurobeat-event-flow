
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VATCalculatorProps {
  netAmount: string;
  setNetAmount: (value: string) => void;
  vatRate: string;
  setVatRate: (value: string) => void;
  grossAmount: string;
  setGrossAmount: (value: string) => void;
}

const VATCalculator: React.FC<VATCalculatorProps> = ({ 
  netAmount, 
  setNetAmount, 
  vatRate, 
  setVatRate, 
  grossAmount, 
  setGrossAmount 
}) => {
  // Calculate gross amount when net amount or VAT rate changes
  const calculateGrossAmount = (net: string, vat: string) => {
    if (net && vat) {
      const netValue = parseFloat(net.replace(/,/g, ''));
      const vatValue = parseFloat(vat);
      
      if (!isNaN(netValue) && !isNaN(vatValue)) {
        const gross = netValue * (1 + vatValue / 100);
        return gross.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
    return "";
  };

  // Handle net amount change
  const handleNetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNetAmount = e.target.value;
    setNetAmount(newNetAmount);
    setGrossAmount(calculateGrossAmount(newNetAmount, vatRate));
  };

  // Handle VAT rate change
  const handleVatRateChange = (value: string) => {
    setVatRate(value);
    setGrossAmount(calculateGrossAmount(netAmount, value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Net Amount</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="amount" 
                  placeholder="0.00" 
                  className="pl-9" 
                  value={netAmount}
                  onChange={handleNetAmountChange}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enter the net amount before VAT</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vat">VAT %</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select onValueChange={handleVatRateChange} value={vatRate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select VAT rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="8">8%</SelectItem>
                    <SelectItem value="23">23%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select the applicable VAT rate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gross">Gross Amount</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="gross" 
                  placeholder="0.00" 
                  className="pl-9" 
                  value={grossAmount}
                  readOnly
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Automatically calculated: Net amount + VAT</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default VATCalculator;
