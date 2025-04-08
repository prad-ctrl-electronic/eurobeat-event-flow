
import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvent } from "@/contexts/EventContext";
import { useStaffing } from "@/contexts/StaffingContext";
import { formatCurrency } from "@/utils/financeUtils";
import { Download, Calculator, Filter, FileText } from "lucide-react";
import { toast } from "sonner";

// Mock data - in a real app, this would come from an API or context
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const vatData = {
  receivables: [
    { month: "January", event: "tf-2025", netAmount: 25000, vatRate: 23, vatAmount: 5750 },
    { month: "February", event: "bn-2025", netAmount: 18500, vatRate: 23, vatAmount: 4255 },
    { month: "March", event: "es-2025", netAmount: 32000, vatRate: 23, vatAmount: 7360 },
    { month: "April", event: "boiler-room", netAmount: 15000, vatRate: 23, vatAmount: 3450 },
  ],
  payables: [
    { month: "January", event: "tf-2025", netAmount: 12000, vatRate: 23, vatAmount: 2760 },
    { month: "February", event: "bn-2025", netAmount: 8500, vatRate: 23, vatAmount: 1955 },
    { month: "March", event: "es-2025", netAmount: 22000, vatRate: 23, vatAmount: 5060 },
    { month: "April", event: "boiler-room", netAmount: 9000, vatRate: 23, vatAmount: 2070 },
  ],
};

// Mock profit data for CIT calculation
const eventProfits = [
  { event: "tf-2025", netProfit: 85000 },
  { event: "bn-2025", netProfit: 62000 },
  { event: "es-2025", netProfit: 45000 },
  { event: "boiler-room", netProfit: 38000 },
];

// Polish tax rates and thresholds
const taxConstants = {
  PIT: {
    standard: 0.12, // 12% standard rate
    higher: 0.32, // 32% higher rate
    threshold: 120000, // PLN threshold for higher rate
    taxFreeAmount: 30000, // Tax-free amount
    flatTax: 0.19, // 19% flat tax for B2B
    ryczalt: {
      software: 0.12, // 12% for software development services
      consulting: 0.15, // 15% for consulting
      other: 0.17, // 17% for other services
    }
  },
  CIT: {
    smallBusiness: 0.09, // 9% for small businesses
    standard: 0.19, // 19% standard rate
    revenueThreshold: 2000000, // EUR threshold for small business status
  },
  ZUS: {
    employer: {
      retirement: 0.0976, // 9.76%
      disability: 0.065, // 6.5%
      accident: 0.0167, // 1.67% (average rate, can vary)
      laborFund: 0.0245, // 2.45%
      fgsp: 0.001, // 0.1%
      total: 0.2048 // Total employer ZUS ~20.48%
    },
    employee: {
      retirement: 0.0976, // 9.76%
      disability: 0.015, // 1.5%
      sickness: 0.0245, // 2.45%
      health: 0.09, // 9% health insurance
      total: 0.2271 // Total employee ZUS ~22.71%
    },
    b2b: {
      minimal: 1418.84, // Minimal ZUS monthly in 2023
      preferencja: 380.25, // Preferential ZUS for first 24 months
      fullContribution: 1600, // Full contribution (approximate)
    }
  },
  VAT: {
    standard: 0.23, // 23% standard rate
    reduced1: 0.08, // 8% reduced rate
    reduced2: 0.05, // 5% reduced rate
    zero: 0 // 0% rate
  }
};

const TaxesTabContent: React.FC = () => {
  const { selectedEventId, events } = useEvent();
  const { staff, filteredStaff } = useStaffing();
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [activeTab, setActiveTab] = useState("vat");
  const [taxRate, setTaxRate] = useState("9"); // Default CIT rate
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Filter VAT data based on selected event and month
  const filteredVatReceivables = vatData.receivables.filter(item => 
    (selectedEventId === "all" || item.event === selectedEventId) &&
    (selectedMonth === "All" || item.month === selectedMonth)
  );
  
  const filteredVatPayables = vatData.payables.filter(item => 
    (selectedEventId === "all" || item.event === selectedEventId) &&
    (selectedMonth === "All" || item.month === selectedMonth)
  );

  // Calculate totals
  const totalVatReceivables = filteredVatReceivables.reduce((sum, item) => sum + item.vatAmount, 0);
  const totalVatPayables = filteredVatPayables.reduce((sum, item) => sum + item.vatAmount, 0);
  const vatDue = totalVatReceivables - totalVatPayables;

  // Filter profit data based on selected event
  const filteredProfits = eventProfits.filter(item => 
    selectedEventId === "all" || item.event === selectedEventId
  );
  
  const totalProfit = filteredProfits.reduce((sum, item) => sum + item.netProfit, 0);
  const citAmount = totalProfit * (taxRate === "9" ? 0.09 : 0.19);

  // Calculate payroll tax data
  const payrollTaxData = useMemo(() => {
    return filteredStaff.map(member => {
      // Default values
      let pitRate = taxConstants.PIT.standard;
      let zusRate = 0;
      let grossSalary = member.rateAmount || 0;
      let employerCost = 0;
      let employeeZus = 0;
      let healthInsurance = 0;
      let pitAmount = 0;
      let netSalary = 0;
      
      // Calculate based on payroll type
      switch (member.payrollType) {
        case "UoP": // Employment contract
          // Calculate full ZUS contributions
          employerCost = grossSalary * (1 + taxConstants.ZUS.employer.total);
          employeeZus = grossSalary * (taxConstants.ZUS.employee.retirement + taxConstants.ZUS.employee.disability + taxConstants.ZUS.employee.sickness);
          healthInsurance = (grossSalary - employeeZus) * taxConstants.ZUS.employee.health;
          
          // PIT calculation (simplified)
          const taxBase = Math.max(0, grossSalary - employeeZus - (taxConstants.PIT.taxFreeAmount / 12));
          pitAmount = taxBase * pitRate;
          
          // Net salary
          netSalary = grossSalary - employeeZus - healthInsurance - pitAmount;
          break;
          
        case "UoD": // Civil contract
          // UoD normally has only health insurance and PIT
          healthInsurance = grossSalary * taxConstants.ZUS.employee.health;
          pitAmount = grossSalary * pitRate;
          netSalary = grossSalary - healthInsurance - pitAmount;
          break;
          
        case "B2B": // Business-to-business
          // For B2B we estimate their own tax burden
          zusRate = taxConstants.ZUS.b2b.fullContribution / grossSalary; // Approximate %
          pitRate = taxConstants.PIT.flatTax; // Flat tax rate for B2B
          
          // These are paid by the contractor themselves
          const estimatedZus = Math.min(taxConstants.ZUS.b2b.fullContribution, grossSalary * 0.3); // Estimate
          const estimatedPit = (grossSalary - estimatedZus) * pitRate;
          
          netSalary = grossSalary - estimatedZus - estimatedPit;
          employerCost = grossSalary; // No employer contributions for B2B
          break;
      }
      
      return {
        ...member,
        grossSalary,
        pitRate: pitRate * 100,
        zusRate: zusRate * 100,
        employerCost,
        employeeZus,
        healthInsurance,
        pitAmount,
        netSalary,
        totalTaxBurden: employerCost - netSalary
      };
    });
  }, [filteredStaff]);
  
  // Calculate tax summary totals
  const taxSummary = useMemo(() => {
    const totalEmployerZus = payrollTaxData.reduce((sum, item) => 
      sum + (item.employerCost - item.grossSalary), 0);
    
    const totalEmployeeZus = payrollTaxData.reduce((sum, item) => 
      sum + (item.employeeZus || 0), 0);
      
    const totalHealthInsurance = payrollTaxData.reduce((sum, item) => 
      sum + (item.healthInsurance || 0), 0);
    
    const totalPit = payrollTaxData.reduce((sum, item) => 
      sum + (item.pitAmount || 0), 0);
    
    return {
      totalEmployerZus,
      totalEmployeeZus,
      totalHealthInsurance,
      totalPit,
      totalVatDue: vatDue,
      totalCit: citAmount,
      totalTaxLiability: totalEmployerZus + totalPit + Math.max(0, vatDue) + citAmount
    };
  }, [payrollTaxData, vatDue, citAmount]);

  const getEventNameById = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : eventId;
  };

  const handleGenerateTaxReport = (type: string) => {
    toast.success(`Generating ${type} tax report`);
    // In a real app, this would generate a PDF or other document
    setTimeout(() => {
      toast.success(`${type} tax report ready for download`);
    }, 1500);
  };

  const handleExportData = (format: string) => {
    toast.success(`Exporting tax data as ${format}`);
    // In a real app, this would export data to the chosen format
  };

  const handleCalculateTaxes = () => {
    toast.success("Recalculating all tax liabilities");
    // This would trigger a full tax recalculation in a real app
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/40 mb-4">
            <TabsTrigger value="vat">VAT</TabsTrigger>
            <TabsTrigger value="income">CIT & PIT</TabsTrigger>
            <TabsTrigger value="zus">ZUS & Payroll</TabsTrigger>
            <TabsTrigger value="summary">Tax Summary</TabsTrigger>
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Months</SelectItem>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showAdvancedOptions && (
        <Card className="bg-muted/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Year</label>
                <Select defaultValue="2025">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                    <SelectItem value="invoices">Invoices</SelectItem>
                    <SelectItem value="payroll">Payroll</SelectItem>
                    <SelectItem value="declarations">Tax Declarations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Status</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="due">Due</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="secondary" className="ml-auto">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleExportData("excel")}>
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleExportData("pdf")}>
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
        <Button size="sm" className="flex items-center gap-1 ml-auto" onClick={handleCalculateTaxes}>
          <Calculator className="h-4 w-4" />
          Calculate Taxes
        </Button>
      </div>

      <TabsContent value="vat" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>VAT Receivables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead className="text-right">VAT Rate</TableHead>
                      <TableHead className="text-right">VAT Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVatReceivables.length > 0 ? (
                      filteredVatReceivables.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>{getEventNameById(item.event)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.netAmount)}</TableCell>
                          <TableCell className="text-right">{item.vatRate}%</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.vatAmount)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          No VAT receivables data available.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredVatReceivables.length > 0 && (
                      <TableRow className="font-medium bg-muted/10">
                        <TableCell colSpan={4} className="text-right">Total VAT Receivables:</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalVatReceivables)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>VAT Payables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead className="text-right">VAT Rate</TableHead>
                      <TableHead className="text-right">VAT Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVatPayables.length > 0 ? (
                      filteredVatPayables.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>{getEventNameById(item.event)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.netAmount)}</TableCell>
                          <TableCell className="text-right">{item.vatRate}%</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.vatAmount)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          No VAT payables data available.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredVatPayables.length > 0 && (
                      <TableRow className="font-medium bg-muted/10">
                        <TableCell colSpan={4} className="text-right">Total VAT Payables:</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalVatPayables)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-primary/5 border border-primary/20">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>VAT Summary</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={() => handleGenerateTaxReport("VAT-7")}
            >
              <FileText className="h-4 w-4" />
              Generate VAT-7
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Total VAT Receivables</div>
                <div className="text-2xl font-bold">{formatCurrency(totalVatReceivables)}</div>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Total VAT Payables</div>
                <div className="text-2xl font-bold">{formatCurrency(totalVatPayables)}</div>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Net VAT Due</div>
                <div className={`text-2xl font-bold ${vatDue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(vatDue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="income" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Corporate Income Tax (CIT)</CardTitle>
              <div className="flex items-center gap-2">
                <div className="text-sm">Tax rate:</div>
                <Select value={taxRate} onValueChange={setTaxRate}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">9%</SelectItem>
                    <SelectItem value="19">19%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Net Profit</TableHead>
                      <TableHead className="text-right">CIT ({taxRate}%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfits.length > 0 ? (
                      filteredProfits.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{getEventNameById(item.event)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.netProfit)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.netProfit * (Number(taxRate) / 100))}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">
                          No profit data available.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredProfits.length > 0 && (
                      <TableRow className="font-medium bg-muted/10">
                        <TableCell colSpan={2} className="text-right">Total CIT Due:</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalProfit * (Number(taxRate) / 100))}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Personal Income Tax (PIT)</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleGenerateTaxReport("PIT-11")}
              >
                <FileText className="h-4 w-4" />
                Generate PIT-11
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Contract Type</TableHead>
                      <TableHead className="text-right">Gross Salary</TableHead>
                      <TableHead className="text-right">PIT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollTaxData.length > 0 ? (
                      payrollTaxData.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell>{item.payrollType}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.grossSalary)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.pitAmount || 0)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          No staff data available.
                        </TableCell>
                      </TableRow>
                    )}
                    {payrollTaxData.length > 0 && (
                      <TableRow className="font-medium bg-muted/10">
                        <TableCell colSpan={4} className="text-right">Total PIT Due:</TableCell>
                        <TableCell className="text-right">{formatCurrency(taxSummary.totalPit)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="zus" className="mt-0">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Staff Payroll & ZUS Analysis</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => handleGenerateTaxReport("ZUS DRA")}
            >
              <FileText className="h-4 w-4" />
              Generate ZUS DRA
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead className="text-right">Gross Salary</TableHead>
                    <TableHead className="text-right">ZUS Employee</TableHead>
                    <TableHead className="text-right">Health Insurance</TableHead>
                    <TableHead className="text-right">PIT</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                    <TableHead className="text-right">Employer Cost</TableHead>
                    <TableHead className="text-right">Total Tax Burden</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollTaxData.length > 0 ? (
                    payrollTaxData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.payrollType}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.grossSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.employeeZus || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.healthInsurance || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.pitAmount || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.netSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.employerCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.totalTaxBurden || 0)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24">
                        No staff data available.
                      </TableCell>
                    </TableRow>
                  )}
                  {payrollTaxData.length > 0 && (
                    <TableRow className="font-medium bg-muted/10">
                      <TableCell colSpan={2} className="text-right">Totals:</TableCell>
                      <TableCell className="text-right">{formatCurrency(payrollTaxData.reduce((sum, item) => sum + item.grossSalary, 0))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(taxSummary.totalEmployeeZus)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(taxSummary.totalHealthInsurance)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(taxSummary.totalPit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payrollTaxData.reduce((sum, item) => sum + item.netSalary, 0))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payrollTaxData.reduce((sum, item) => sum + item.employerCost, 0))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payrollTaxData.reduce((sum, item) => sum + (item.totalTaxBurden || 0), 0))}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="summary" className="mt-0">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Tax Summary Dashboard</CardTitle>
            <CardDescription>
              {selectedEventId !== 'all' 
                ? `Tax summary for ${getEventNameById(selectedEventId)}` 
                : `All-events tax summary for ${selectedMonth !== 'All' ? selectedMonth : 'all months'}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">VAT Due</div>
                <div className={`text-2xl font-bold ${vatDue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(vatDue)}
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">CIT ({taxRate}%)</div>
                <div className="text-2xl font-bold">{formatCurrency(citAmount)}</div>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">PIT (Staff)</div>
                <div className="text-2xl font-bold">{formatCurrency(taxSummary.totalPit)}</div>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Employer ZUS</div>
                <div className="text-2xl font-bold">{formatCurrency(taxSummary.totalEmployerZus)}</div>
              </div>
            </div>

            <div className="mt-8 bg-primary/5 p-6 rounded-lg border border-primary/20">
              <div className="text-lg font-semibold mb-4">Total Tax Liability</div>
              <div className="text-3xl font-bold">
                {formatCurrency(taxSummary.totalTaxLiability)}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tax Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateTaxReport("VAT-7")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate VAT-7
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateTaxReport("PIT-11")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate PIT-11
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateTaxReport("CIT-8")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate CIT-8
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateTaxReport("ZUS DRA")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate ZUS DRA
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tax Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tax Type</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>VAT</TableCell>
                        <TableCell>25.04.2025</TableCell>
                        <TableCell>{formatCurrency(vatDue)}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Upcoming</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ZUS</TableCell>
                        <TableCell>15.04.2025</TableCell>
                        <TableCell>{formatCurrency(taxSummary.totalEmployerZus)}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Upcoming</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PIT</TableCell>
                        <TableCell>20.04.2025</TableCell>
                        <TableCell>{formatCurrency(taxSummary.totalPit)}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Upcoming</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="calculator" className="mt-0">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Polish Tax Calculator</CardTitle>
            <CardDescription>Calculate tax obligations for different contract types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contract Settings</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contract Type</label>
                      <Select defaultValue="UoP">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UoP">UoP (Employment)</SelectItem>
                          <SelectItem value="UoD">UoD (Civil Contract)</SelectItem>
                          <SelectItem value="B2B">B2B (Business to Business)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gross Salary (PLN)</label>
                      <Input type="number" defaultValue="5000" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">B2B Tax Type</label>
                      <Select defaultValue="flat">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat Tax (19%)</SelectItem>
                          <SelectItem value="progressive">Progressive (12%/32%)</SelectItem>
                          <SelectItem value="ryczalt">Ryczałt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZUS Preference</label>
                      <Select defaultValue="full">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full ZUS</SelectItem>
                          <SelectItem value="preferential">Preferential (first 24 mo)</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="mt-4 w-full">Calculate</Button>
                </div>
                
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Tax Rates Reference</h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>PIT (Standard)</div>
                        <div>12% up to 120,000 PLN</div>
                        
                        <div>PIT (Higher)</div>
                        <div>32% above 120,000 PLN</div>
                        
                        <div>Flat Tax (B2B)</div>
                        <div>19%</div>
                        
                        <div>CIT (Small Business)</div>
                        <div>9% (up to €2M revenue)</div>
                        
                        <div>CIT (Standard)</div>
                        <div>19%</div>
                        
                        <div>VAT (Standard)</div>
                        <div>23%</div>
                        
                        <div>VAT (Reduced)</div>
                        <div>8% / 5% / 0%</div>
                        
                        <div>ZUS (Full, 2023)</div>
                        <div>~1600 PLN/month</div>
                        
                        <div>ZUS (Preferential)</div>
                        <div>~380 PLN/month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-muted/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Calculation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-muted-foreground">Gross Salary:</div>
                        <div className="font-medium text-right">5,000.00 PLN</div>
                        
                        <div className="text-muted-foreground">Employee ZUS:</div>
                        <div className="font-medium text-right">685.30 PLN</div>
                        
                        <div className="text-muted-foreground">Health Insurance:</div>
                        <div className="font-medium text-right">388.32 PLN</div>
                        
                        <div className="text-muted-foreground">Tax Base:</div>
                        <div className="font-medium text-right">4,314.70 PLN</div>
                        
                        <div className="text-muted-foreground">PIT (12%):</div>
                        <div className="font-medium text-right">129.76 PLN</div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-medium">
                          <div>Net Salary:</div>
                          <div className="text-xl">3,796.62 PLN</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-muted-foreground">Employer Costs:</div>
                        <div className="grid grid-cols-2 gap-y-1 pl-4">
                          <div className="text-muted-foreground">ZUS - Retirement:</div>
                          <div className="text-right">488.00 PLN</div>
                          
                          <div className="text-muted-foreground">ZUS - Disability:</div>
                          <div className="text-right">325.00 PLN</div>
                          
                          <div className="text-muted-foreground">ZUS - Accident:</div>
                          <div className="text-right">83.50 PLN</div>
                          
                          <div className="text-muted-foreground">Labor Fund:</div>
                          <div className="text-right">122.50 PLN</div>
                        </div>
                        
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <div>Total Employer Cost:</div>
                          <div>6,019.00 PLN</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-primary font-bold">
                          <div>Total Tax Burden:</div>
                          <div>2,222.38 PLN (44.4%)</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="outline" className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Detailed Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TaxesTabContent;

