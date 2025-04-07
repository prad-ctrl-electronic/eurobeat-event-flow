
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown, Printer } from "lucide-react";

// Sample data from the CSV
const invoiceData = [
  {
    code: "05 - Teletech",
    supplier: "Project C AB",
    invoiceNumber: "PCA/I24-000164",
    taxNumber: "",
    vatId: "SE559342235401",
    bankAccount: "SE21 9500 0099 6018 1944 9974",
    bicSwift: "NDEASESS",
    operation: "Transfer",
    issueDate: "11.10.2024",
    dueDate: "18.10.2024",
    amountNet: "",
    vat: "",
    amountGross: "600.00",
    currency: "EUR",
    exchangeRate: "4.35",
    amountPLN: "2,610.00",
    status: "Alredy paid",
    paymentDate: "04/11/2024",
    comment: "Booking fee for the artist Nur Jaber"
  },
  {
    code: "05 - Teletech",
    supplier: "Sometimescreative GmbH",
    invoiceNumber: "RE2024015",
    taxNumber: "",
    vatId: "DE2753750632",
    bankAccount: "DE05100101238755024708",
    bicSwift: "QNTODEB2XXX",
    operation: "Transger",
    issueDate: "01.11.2024",
    dueDate: "15.11.2024",
    amountNet: "",
    vat: "",
    amountGross: "5,000.00",
    currency: "EUR",
    exchangeRate: "4.35",
    amountPLN: "21,750.00",
    status: "Already paid",
    paymentDate: "04/11/2024",
    comment: "Digital marketing"
  },
  {
    code: "02 - Burn Warsaw",
    supplier: "DAREKRADIO Dariusz Przepióra",
    invoiceNumber: "953/10/2024",
    taxNumber: "",
    vatId: "",
    bankAccount: "53 2490 0005 0000 4500 5875 8629",
    bicSwift: "",
    operation: "Transger",
    issueDate: "22.10.2024",
    dueDate: "31.10.2024",
    amountNet: "1,140.00",
    vat: "262.20",
    amountGross: "1,402.20",
    currency: "PLN",
    exchangeRate: "",
    amountPLN: "1,402.20",
    status: "Already paid",
    paymentDate: "07/11/2024",
    comment: "Radio"
  },
  {
    code: "02 - Burn Warsaw",
    supplier: "Useme sp. z o.o.",
    invoiceNumber: "Pro forma UMZ6FJCJ",
    taxNumber: "",
    vatId: "",
    bankAccount: "64 1050 1575 1000 0090 3136 0424",
    bicSwift: "",
    operation: "Transger",
    issueDate: "07.11.2024",
    dueDate: "07.11.2024",
    amountNet: "8,314.00",
    vat: "1,912.22",
    amountGross: "10,226.22",
    currency: "PLN",
    exchangeRate: "",
    amountPLN: "10,226.22",
    status: "Already paid",
    paymentDate: "07/11/2024",
    comment: "Marketing / Copywriting i teksty Burn on Tour x Mixmag PR"
  },
  {
    code: "02 - Burn Warsaw",
    supplier: "MICHAŁ CYMERMAN",
    invoiceNumber: "Nr 4/10/2024",
    taxNumber: "",
    vatId: "",
    bankAccount: "04 2490 0005 0000 4500 3686 7484",
    bicSwift: "",
    operation: "Transger",
    issueDate: "21.10.2024",
    dueDate: "04.11.2024",
    amountNet: "6,250.00",
    vat: "1,437.50",
    amountGross: "7,687.50",
    currency: "PLN",
    exchangeRate: "",
    amountPLN: "7,687.50",
    status: "Already paid",
    paymentDate: "07/11/2024",
    comment: "Technikal supplier"
  },
  {
    code: "04 - Boiler room Warsaw",
    supplier: "Luke Slater Productions Ltd.",
    invoiceNumber: "LSP-2024850",
    taxNumber: "",
    vatId: "GB691027636",
    bankAccount: "BE11 9671 6256 0848",
    bicSwift: "TRWIBEB1XXX",
    operation: "Transger",
    issueDate: "08/11/2024",
    dueDate: "08/11/2024",
    amountNet: "",
    vat: "",
    amountGross: "6,500.00",
    currency: "EUR",
    exchangeRate: "4.35",
    amountPLN: "28,275.00",
    status: "Already paid",
    paymentDate: "08/11/2024",
    comment: "Artists payment"
  }
];

const InvoiceTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(invoiceData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setFilteredData(invoiceData);
    } else {
      const filtered = invoiceData.filter(
        (invoice) =>
          invoice.supplier.toLowerCase().includes(term) ||
          invoice.invoiceNumber.toLowerCase().includes(term) ||
          invoice.comment.toLowerCase().includes(term) ||
          invoice.code.toLowerCase().includes(term)
      );
      setFilteredData(filtered);
    }
  };

  const calculateTotal = () => {
    return filteredData
      .reduce((sum, invoice) => {
        const amount = parseFloat(invoice.amountPLN.replace(/,/g, ""));
        return isNaN(amount) ? sum : sum + amount;
      }, 0)
      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableCaption className="mt-2">
            <div className="flex justify-between items-center px-4">
              <span>Showing {filteredData.length} of {invoiceData.length} invoices</span>
              <span className="font-medium">Total: PLN {calculateTotal()}</span>
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Supplier</TableHead>
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
            {filteredData.length > 0 ? (
              filteredData.map((invoice, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/60">
                  <TableCell className="font-medium">{invoice.code}</TableCell>
                  <TableCell>{invoice.supplier}</TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell className="text-right">{invoice.amountGross}</TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell className="text-right">{invoice.amountPLN}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell>{invoice.paymentDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center h-24">
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

export default InvoiceTable;
