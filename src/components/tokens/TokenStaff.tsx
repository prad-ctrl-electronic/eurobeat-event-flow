
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

const TokenStaff: React.FC = () => {
  const { staffTokens, isLoading } = useTokens();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading staff token data...</div>;
  }

  // Calculate token type totals
  const tokenTypeTotals = staffTokens.reduce((acc, staff) => {
    const { tokenType, tokensIssued } = staff;
    acc[tokenType] = (acc[tokenType] || 0) + tokensIssued;
    return acc;
  }, {} as Record<string, number>);

  const totalTokensIssued = Object.values(tokenTypeTotals).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Staff Tokens</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Staff Tokens</h3>
          <p className="text-2xl font-bold">{totalTokensIssued}</p>
        </div>
        
        {Object.entries(tokenTypeTotals).map(([type, count]) => (
          <div key={type} className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{type} Tokens</h3>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        ))}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">№</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Token Type</TableHead>
              <TableHead>Tokens Issued</TableHead>
              <TableHead>Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffTokens.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.id}</TableCell>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.tokenType}</TableCell>
                <TableCell>{staff.tokensIssued}</TableCell>
                <TableCell>{staff.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TokenStaff;
