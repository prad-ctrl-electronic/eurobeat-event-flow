
import React, { useState, useRef } from "react";
import { useTokens } from "@/contexts/TokenContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvent } from "@/contexts/EventContext";
import { toast } from "sonner";
import { TokenImport } from "@/types/token";

const TokenDataImport: React.FC = () => {
  const { addMultiplePositions, addTokenPosition } = useTokens();
  const { events } = useEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<TokenImport[]>([]);
  const [newPosition, setNewPosition] = useState<TokenImport>({
    position: 0,
    eventId: "",
    transactions: 0,
    tokensSold: 0,
    cardPayments: 0,
    expectedRevenue: 0,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        
        // Check if this is the right format
        if (!headers.includes("Position Number") && !headers.includes("position")) {
          toast.error("Invalid CSV format. Please use the correct template.");
          return;
        }
        
        // Find the indices of the columns we need
        const positionIndex = headers.findIndex(h => 
          h.includes("Position") || h.includes("position"));
        const transactionsIndex = headers.findIndex(h => 
          h.includes("transactions") || h.includes("Number of transactions"));
        const tokensSoldIndex = headers.findIndex(h => 
          h.includes("Tokens sold") || h.includes("tokens"));
        const cardPaymentsIndex = headers.findIndex(h => 
          h.includes("Card Payments"));
        const revenueIndex = headers.findIndex(h => 
          h.includes("Expected Revenue"));

        // Required columns must exist
        if (positionIndex === -1 || transactionsIndex === -1 || 
            tokensSoldIndex === -1 || cardPaymentsIndex === -1) {
          toast.error("Missing required columns in CSV file");
          return;
        }

        const data: TokenImport[] = [];
        
        // Start from line 1 (skipping headers)
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(",");
          
          // Try to parse position
          const position = parseInt(values[positionIndex]);
          if (isNaN(position)) continue;
          
          const transactions = parseInt(values[transactionsIndex]) || 0;
          const tokensSold = parseInt(values[tokensSoldIndex]) || 0;
          
          // For card payments and revenue, remove any non-numeric characters
          let cardPayments = values[cardPaymentsIndex]
            ? parseFloat(values[cardPaymentsIndex].replace(/[^\d.-]/g, ""))
            : 0;
            
          let expectedRevenue = revenueIndex !== -1 && values[revenueIndex]
            ? parseFloat(values[revenueIndex].replace(/[^\d.-]/g, ""))
            : cardPayments;
            
          if (isNaN(cardPayments)) cardPayments = 0;
          if (isNaN(expectedRevenue)) expectedRevenue = 0;
          
          data.push({
            position,
            eventId: "",  // User will need to select this
            transactions,
            tokensSold,
            cardPayments,
            expectedRevenue,
          });
        }
        
        if (data.length === 0) {
          toast.error("No valid data found in CSV file");
          return;
        }
        
        setParsedData(data);
        toast.success(`Parsed ${data.length} positions from CSV`);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
      }
    };
    
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (parsedData.length === 0) {
      toast.error("No data to import");
      return;
    }
    
    // Check if all positions have event IDs
    const missingEventIds = parsedData.some(item => !item.eventId);
    if (missingEventIds) {
      toast.error("Please assign an event to all positions");
      return;
    }
    
    addMultiplePositions(parsedData);
    toast.success(`Imported ${parsedData.length} positions successfully`);
    setParsedData([]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateEventForAllRows = (eventId: string) => {
    setParsedData(data => data.map(item => ({ ...item, eventId })));
  };

  const updateEventForRow = (index: number, eventId: string) => {
    setParsedData(data => {
      const newData = [...data];
      newData[index] = { ...newData[index], eventId };
      return newData;
    });
  };

  const handleAddSinglePosition = () => {
    if (!newPosition.eventId) {
      toast.error("Please select an event");
      return;
    }

    if (newPosition.position <= 0) {
      toast.error("Position number must be greater than 0");
      return;
    }

    addTokenPosition(newPosition);
    toast.success("Position added successfully");
    
    // Reset form
    setNewPosition({
      position: 0,
      eventId: "",
      transactions: 0,
      tokensSold: 0,
      cardPayments: 0,
      expectedRevenue: 0,
    });
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Add Single Position</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="position">Position Number</Label>
            <Input 
              id="position" 
              type="number" 
              min="1"
              value={newPosition.position || ''} 
              onChange={(e) => setNewPosition({
                ...newPosition, 
                position: parseInt(e.target.value) || 0
              })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="event">Event</Label>
            <Select 
              value={newPosition.eventId} 
              onValueChange={(value) => setNewPosition({...newPosition, eventId: value})}
            >
              <SelectTrigger id="event" className="mt-1">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events.filter(e => e.id !== "all").map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="transactions">Number of Transactions</Label>
            <Input 
              id="transactions" 
              type="number" 
              min="0"
              value={newPosition.transactions || ''} 
              onChange={(e) => setNewPosition({
                ...newPosition, 
                transactions: parseInt(e.target.value) || 0
              })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="tokensSold">Tokens Sold</Label>
            <Input 
              id="tokensSold" 
              type="number" 
              min="0"
              value={newPosition.tokensSold || ''} 
              onChange={(e) => setNewPosition({
                ...newPosition, 
                tokensSold: parseInt(e.target.value) || 0
              })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="cardPayments">Card Payments (PLN)</Label>
            <Input 
              id="cardPayments" 
              type="number" 
              min="0"
              value={newPosition.cardPayments || ''} 
              onChange={(e) => setNewPosition({
                ...newPosition, 
                cardPayments: parseFloat(e.target.value) || 0
              })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="expectedRevenue">Expected Revenue (PLN)</Label>
            <Input 
              id="expectedRevenue" 
              type="number" 
              min="0"
              value={newPosition.expectedRevenue || ''} 
              onChange={(e) => setNewPosition({
                ...newPosition, 
                expectedRevenue: parseFloat(e.target.value) || 0
              })}
              className="mt-1"
            />
          </div>
        </div>
        
        <Button onClick={handleAddSinglePosition} className="mt-6">
          Add Position
        </Button>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Import Token Data from CSV</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upload a CSV file with position data. The file should include columns for Position Number, 
          Number of Transactions, Tokens Sold, Card Payments, and Expected Revenue.
        </p>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="csvFile">Upload CSV File</Label>
            <Input 
              id="csvFile" 
              type="file" 
              accept=".csv" 
              ref={fileInputRef}
              onChange={handleFileUpload} 
              className="mt-1"
            />
          </div>
          
          {parsedData.length > 0 && (
            <>
              <div>
                <Label htmlFor="bulkEvent">Assign Event to All Rows</Label>
                <Select onValueChange={updateEventForAllRows}>
                  <SelectTrigger id="bulkEvent" className="mt-1">
                    <SelectValue placeholder="Select event for all rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.filter(e => e.id !== "all").map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Tokens Sold</TableHead>
                      <TableHead>Card Payments</TableHead>
                      <TableHead>Expected Revenue</TableHead>
                      <TableHead>Event</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.transactions}</TableCell>
                        <TableCell>{item.tokensSold}</TableCell>
                        <TableCell>{item.cardPayments.toLocaleString()}</TableCell>
                        <TableCell>{item.expectedRevenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select 
                            value={item.eventId} 
                            onValueChange={(value) => updateEventForRow(index, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select event" />
                            </SelectTrigger>
                            <SelectContent>
                              {events.filter(e => e.id !== "all").map((event) => (
                                <SelectItem key={event.id} value={event.id}>
                                  {event.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Button onClick={handleImport}>Import Data</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TokenDataImport;
