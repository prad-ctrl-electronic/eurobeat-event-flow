
import React from "react";
import { useTokens } from "@/contexts/TokenContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExportDropdown from "@/components/common/ExportDropdown";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const TokenPositions: React.FC = () => {
  const { positions } = useTokens();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPositions = positions.filter(position => 
    position.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (format: "excel" | "pdf") => {
    console.log(`Exporting positions data to ${format}`);
    // Implementation for export functionality would go here
  };

  const totalTransactions = positions.reduce((sum, pos) => sum + pos.transactions, 0);
  const totalTokensSold = positions.reduce((sum, pos) => sum + pos.tokensSold, 0);
  const totalCardPayments = positions.reduce((sum, pos) => sum + pos.cardPayments, 0);
  const totalExpectedRevenue = positions.reduce((sum, pos) => sum + pos.expectedRevenue, 0);
  const totalDifference = positions.reduce((sum, pos) => sum + pos.difference, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Position Analysis</h2>
        <ExportDropdown onExport={handleExport} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Position Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Positions</p>
              <p className="text-2xl font-bold">{positions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">{totalTransactions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tokens Sold</p>
              <p className="text-2xl font-bold">{totalTokensSold.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Card Payments</p>
              <p className="text-2xl font-bold">{totalCardPayments.toLocaleString()} zł</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Difference</p>
              <p className="text-2xl font-bold">{totalDifference.toLocaleString()} zł</p>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search positions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Tokens Sold</TableHead>
                  <TableHead className="text-right">Card Payments (zł)</TableHead>
                  <TableHead className="text-right">Expected Revenue (zł)</TableHead>
                  <TableHead className="text-right">Difference (zł)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">{position.name}</TableCell>
                    <TableCell className="text-right">{position.transactions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{position.tokensSold.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{position.cardPayments.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{position.expectedRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{position.difference.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenPositions;
