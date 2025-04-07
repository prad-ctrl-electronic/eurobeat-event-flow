
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CreditCard } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { vendors, getVendorInvoices, getVendorStatistics } from "@/data/vendorData";

const VendorOverview: React.FC = () => {
  const { selectedEventId } = useEvent();
  
  // Get top 5 vendors by expense
  const topVendors = [...vendors]
    .map(vendor => {
      const stats = getVendorStatistics(vendor.id);
      return {
        ...vendor,
        totalSpend: stats.totalPaid + stats.outstandingBalance,
      };
    })
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .filter(vendor => {
      // Filter by selected event if needed
      if (selectedEventId === "all") return true;
      
      const vendorInvoices = getVendorInvoices().filter(invoice => {
        const matchedVendor = vendors.find(v => v.name === invoice.supplier);
        return matchedVendor?.id === vendor.id && invoice.event === selectedEventId;
      });
      
      return vendorInvoices.length > 0;
    })
    .slice(0, 5);
  
  // Get vendors with unpaid invoices
  const vendorsWithUnpaidInvoices = vendors.filter(vendor => {
    const vendorInvoices = getVendorInvoices().filter(invoice => {
      const matchedVendor = vendors.find(v => v.name === invoice.supplier);
      const eventMatch = selectedEventId === "all" || invoice.event === selectedEventId;
      return matchedVendor?.id === vendor.id && eventMatch && invoice.status !== "Already paid";
    });
    
    return vendorInvoices.length > 0;
  }).slice(0, 3);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Vendor Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-2 text-sm">Top Vendors by Expense</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Total Spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topVendors.length > 0 ? (
                topVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="font-medium line-clamp-1">{vendor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {vendor.serviceCategories.slice(0, 2).join(", ")}
                        {vendor.serviceCategories.length > 2 && "..."}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      PLN {vendor.totalSpend.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No vendor data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {vendorsWithUnpaidInvoices.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-sm text-amber-500 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> 
              Vendors with Unpaid Invoices
            </h4>
            <div className="space-y-2">
              {vendorsWithUnpaidInvoices.map((vendor) => {
                const stats = getVendorStatistics(vendor.id);
                return (
                  <div 
                    key={vendor.id} 
                    className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
                  >
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        <span>Due: PLN {stats.outstandingBalance.toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {vendor.serviceCategories[0]}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorOverview;
