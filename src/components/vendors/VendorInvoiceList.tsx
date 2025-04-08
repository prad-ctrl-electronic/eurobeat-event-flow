
import React, { useState } from "react";
import { 
  Table, 
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ActionButtonDropdown } from "@/components/ui/action-button-dropdown";
import { Search, Download, Printer, FileSpreadsheet, FilePdf } from "lucide-react";
import { vendors, getVendorInvoices } from "@/data/vendorData";
import { invoiceStatusOptions } from "@/components/finance/InvoiceTable";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportData } from "@/utils/exportUtils";

interface VendorInvoiceListProps {
  vendorId: string;
  selectedEventId: string;
}

const VendorInvoiceList: React.FC<VendorInvoiceListProps> = ({ vendorId, selectedEventId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get vendor and invoices
  const vendor = vendors.find(v => v.id === vendorId);
  const allInvoices = getVendorInvoices().filter(invoice => {
    const matchedVendor = vendors.find(v => v.name === invoice.supplier);
    return matchedVendor?.id === vendorId;
  });
  
  // Filter by event and search term
  const filteredInvoices = allInvoices.filter(invoice => {
    const eventMatch = selectedEventId === "all" || invoice.event === selectedEventId;
    const searchMatch = 
      searchTerm === "" ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    return eventMatch && searchMatch;
  });
  
  const calculateTotal = () => {
    return filteredInvoices
      .reduce((sum, invoice) => {
        const amount = parseFloat(invoice.amountPLN.replace(/,/g, ""));
        return isNaN(amount) ? sum : sum + amount;
      }, 0)
      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const handleStatusChange = (index: number, value: string) => {
    toast.success(`Invoice status updated to "${value}"`);
  };

  const handleExport = (format: "excel" | "pdf") => {
    const vendorName = vendor?.name || "vendor";
    
    exportData(filteredInvoices, {
      format,
      module: "vendors",
      submodule: "vendor-invoices",
      eventName: selectedEventId !== "all" ? selectedEventId : undefined,
      fileName: `${vendorName.toLowerCase().replace(/\s+/g, '-')}-invoices.${format === 'excel' ? 'xlsx' : 'pdf'}`,
      filters: {
        vendor: vendorId,
        event: selectedEventId,
        search: searchTerm
      }
    });
  };
  
  // Get status color class based on status value
  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'already paid':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'unpaid':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case 'processing':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case 'cancelled':
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FilePdf className="h-4 w-4 mr-2" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableCaption>
            <div className="flex justify-between items-center px-4">
              <span>Showing {filteredInvoices.length} of {allInvoices.length} invoices</span>
              <span className="font-medium">Total: PLN {calculateTotal()}</span>
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Amount (PLN)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, index) => (
                <TableRow key={index} className="hover:bg-muted/60">
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell className="text-right">{invoice.amountGross}</TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell className="text-right">{invoice.amountPLN}</TableCell>
                  <TableCell>
                    <ActionButtonDropdown
                      value={invoice.status}
                      options={invoiceStatusOptions}
                      onValueChange={(value) => handleStatusChange(index, value)}
                      isEditing={true}
                      showActions={false}
                      autoSave={true}
                      className="min-w-[120px]"
                    />
                  </TableCell>
                  <TableCell>{invoice.paymentDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No invoices found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorInvoiceList;
