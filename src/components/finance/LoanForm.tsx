
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Loan, addLoan } from "@/utils/debtUtils";

interface LoanFormProps {
  onLoanAdded: (loan: Loan) => void;
  existingLoans: Loan[];
}

const LoanForm: React.FC<LoanFormProps> = ({ onLoanAdded, existingLoans }) => {
  const [lender, setLender] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [interestRate, setInterestRate] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [repaymentSchedule, setRepaymentSchedule] = useState<"monthly" | "quarterly" | "annually" | "custom">("monthly");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lender || !amount || !interestRate || !startDate || !endDate || !repaymentSchedule || !repaymentAmount) {
      return;
    }
    
    const newLoan = {
      lender,
      amount: parseFloat(amount),
      currency,
      interestRate: parseFloat(interestRate),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      repaymentSchedule,
      repaymentAmount: parseFloat(repaymentAmount),
      status: "active" as const,
      description
    };
    
    const updatedLoans = addLoan(newLoan, existingLoans);
    const addedLoan = updatedLoans[updatedLoans.length - 1];
    onLoanAdded(addedLoan);
    
    // Reset form
    setLender("");
    setAmount("");
    setCurrency("EUR");
    setInterestRate("");
    setStartDate(new Date());
    setEndDate(undefined);
    setRepaymentSchedule("monthly");
    setRepaymentAmount("");
    setDescription("");
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Add New Loan</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lender">Lender / Bank</Label>
            <Input 
              id="lender" 
              value={lender} 
              onChange={(e) => setLender(e.target.value)} 
              placeholder="e.g. ABC Bank"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount</Label>
            <div className="flex">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="EUR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="PLN">PLN</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                id="amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="flex-1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interest">Interest Rate (%)</Label>
            <Input 
              id="interest" 
              value={interestRate} 
              onChange={(e) => setInterestRate(e.target.value)}
              type="number"
              min="0"
              step="0.01" 
              placeholder="e.g. 5.25"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repaymentSchedule">Repayment Schedule</Label>
            <Select 
              value={repaymentSchedule} 
              onValueChange={(val) => setRepaymentSchedule(val as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repaymentAmount">Repayment Amount</Label>
            <Input 
              id="repaymentAmount" 
              value={repaymentAmount} 
              onChange={(e) => setRepaymentAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01" 
              placeholder="Regular payment amount"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description / Notes</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional information about this loan"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button type="submit">Add Loan</Button>
        </div>
      </form>
    </Card>
  );
};

export default LoanForm;
