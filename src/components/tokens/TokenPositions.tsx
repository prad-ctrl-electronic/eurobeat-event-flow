
import React from "react";
import { useTokens } from "@/contexts/TokenContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const TokenPositions: React.FC = () => {
  const { positions, isLoading } = useTokens();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading position data...</div>;
  }

  // Calculate totals
  const totals = positions.reduce(
    (acc, pos) => {
      acc.transactions += pos.transactions;
      acc.tokensSold += pos.tokensSold;
      acc.cardPayments += pos.cardPayments;
      acc.expectedRevenue += pos.expectedRevenue;
      acc.difference += pos.difference;
      return acc;
    },
    { transactions: 0, tokensSold: 0, cardPayments: 0, expectedRevenue: 0, difference: 0 }
  );

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Token Positions Analysis</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Position</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Tokens Sold</TableHead>
              <TableHead>Card Payments (PLN)</TableHead>
              <TableHead>Expected Revenue (PLN)</TableHead>
              <TableHead>Difference (PLN)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.position}>
                <TableCell className="font-medium">{position.position}</TableCell>
                <TableCell>{position.transactions}</TableCell>
                <TableCell>{position.tokensSold}</TableCell>
                <TableCell>{position.cardPayments.toLocaleString()}</TableCell>
                <TableCell>{position.expectedRevenue.toLocaleString()}</TableCell>
                <TableCell>{position.difference}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-bold">
              <TableCell>TOTAL</TableCell>
              <TableCell>{totals.transactions}</TableCell>
              <TableCell>{totals.tokensSold}</TableCell>
              <TableCell>{totals.cardPayments.toLocaleString()}</TableCell>
              <TableCell>{totals.expectedRevenue.toLocaleString()}</TableCell>
              <TableCell>{totals.difference}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TokenPositions;
