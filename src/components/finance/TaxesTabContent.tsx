
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvent } from "@/contexts/EventContext";
import { formatCurrency } from "@/utils/financeUtils";

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

// Mock staff data for CIT, PIT, ZUS calculations
const staffData = [
  { 
    name: "John Doe", 
    position: "Event Manager", 
    event: "tf-2025", 
    grossSalary: 8500, 
    contractType: "permanent",
    pitRate: 12,
    zusRate: 19.21,
  },
  { 
    name: "Jane Smith", 
    position: "Marketing Director", 
    event: "bn-2025", 
    grossSalary: 7800,
    contractType: "b2b",
    pitRate: 12,
    zusRate: 0, // No ZUS for B2B
  },
  { 
    name: "Mark Johnson", 
    position: "Technical Director", 
    event: "es-2025", 
    grossSalary: 6500,
    contractType: "permanent",
    pitRate: 12,
    zusRate: 19.21,
  },
  { 
    name: "Sarah Wilson", 
    position: "Production Assistant", 
    event: "boiler-room", 
    grossSalary: 4200,
    contractType: "permanent",
    pitRate: 12,
    zusRate: 19.21,
  },
];

// Mock profit data for CIT calculation
const eventProfits = [
  { event: "tf-2025", netProfit: 85000 },
  { event: "bn-2025", netProfit: 62000 },
  { event: "es-2025", netProfit: 45000 },
  { event: "boiler-room", netProfit: 38000 },
];

const TaxesTabContent: React.FC = () => {
  const { selectedEventId, events } = useEvent();
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [activeTab, setActiveTab] = useState("vat");

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

  // Filter staff data based on selected event
  const filteredStaff = staffData.filter(item => 
    selectedEventId === "all" || item.event === selectedEventId
  );

  // Calculate staff tax totals
  const totalPIT = filteredStaff.reduce((sum, item) => 
    sum + (item.grossSalary * (item.pitRate / 100)), 0);
  
  const totalZUS = filteredStaff.reduce((sum, item) => 
    sum + (item.grossSalary * (item.zusRate / 100)), 0);

  // Calculate CIT based on filtered event profits
  const filteredProfits = eventProfits.filter(item => 
    selectedEventId === "all" || item.event === selectedEventId
  );
  
  const totalProfit = filteredProfits.reduce((sum, item) => sum + item.netProfit, 0);
  const citAmount = totalProfit * 0.09; // 9% CIT

  const getEventNameById = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : eventId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/40 mb-4">
            <TabsTrigger value="vat">VAT</TabsTrigger>
            <TabsTrigger value="income">CIT & PIT</TabsTrigger>
            <TabsTrigger value="zus">ZUS</TabsTrigger>
            <TabsTrigger value="summary">Tax Summary</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full md:w-auto">
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
        </div>
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
          <CardHeader>
            <CardTitle>VAT Summary</CardTitle>
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
            <CardHeader>
              <CardTitle>Corporate Income Tax (CIT) - 9%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Net Profit</TableHead>
                      <TableHead className="text-right">CIT (9%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfits.length > 0 ? (
                      filteredProfits.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{getEventNameById(item.event)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.netProfit)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.netProfit * 0.09)}</TableCell>
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
                        <TableCell className="text-right">{formatCurrency(citAmount)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Personal Income Tax (PIT) - 12%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Contract Type</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Gross Salary</TableHead>
                      <TableHead className="text-right">PIT (12%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.position}</TableCell>
                          <TableCell>{item.contractType}</TableCell>
                          <TableCell>{getEventNameById(item.event)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.grossSalary)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.grossSalary * (item.pitRate / 100))}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No staff data available.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredStaff.length > 0 && (
                      <TableRow className="font-medium bg-muted/10">
                        <TableCell colSpan={5} className="text-right">Total PIT Due:</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalPIT)}</TableCell>
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
          <CardHeader>
            <CardTitle>Social Security Contributions (ZUS) - 19.21%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contract Type</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead className="text-right">Gross Salary</TableHead>
                    <TableHead className="text-right">ZUS Rate</TableHead>
                    <TableHead className="text-right">ZUS Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.contractType}</TableCell>
                        <TableCell>{getEventNameById(item.event)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.grossSalary)}</TableCell>
                        <TableCell className="text-right">{item.zusRate}%</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.grossSalary * (item.zusRate / 100))}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No staff data available.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredStaff.length > 0 && (
                    <TableRow className="font-medium bg-muted/10">
                      <TableCell colSpan={6} className="text-right">Total ZUS Due:</TableCell>
                      <TableCell className="text-right">{formatCurrency(totalZUS)}</TableCell>
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
            <CardTitle>Tax Summary</CardTitle>
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
                <div className="text-sm text-muted-foreground mb-2">CIT (9%)</div>
                <div className="text-2xl font-bold">{formatCurrency(citAmount)}</div>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">PIT (12%)</div>
                <div className="text-2xl font-bold">{formatCurrency(totalPIT)}</div>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">ZUS (19.21%)</div>
                <div className="text-2xl font-bold">{formatCurrency(totalZUS)}</div>
              </div>
            </div>

            <div className="mt-8 bg-primary/5 p-6 rounded-lg border border-primary/20">
              <div className="text-lg font-semibold mb-4">Total Tax Liability</div>
              <div className="text-3xl font-bold">
                {formatCurrency(Math.max(0, vatDue) + citAmount + totalPIT + totalZUS)}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TaxesTabContent;
