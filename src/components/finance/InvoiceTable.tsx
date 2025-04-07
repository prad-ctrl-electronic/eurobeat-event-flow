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
import { Search, FileDown, Printer, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActionButtons } from "@/components/ui/action-buttons";
import { ActionButtonDropdown } from "@/components/ui/action-button-dropdown";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEvent } from "@/contexts/EventContext";

// Status options
export const invoiceStatusOptions = [
  { value: "Already paid", label: "Already paid" },
  { value: "Unpaid", label: "Unpaid" },
  { value: "Processing", label: "Processing" },
  { value: "Cancelled", label: "Cancelled" },
];

// Export the invoice data to be used in other components
export const invoiceData = [
  {
    code: "05 - Teletech",
    event: "boiler-room",
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
    status: "Already paid",
    paymentDate: "04/11/2024",
    comment: "Booking fee for the artist Nur Jaber"
  },
  {
    code: "05 - Teletech",
    event: "tf-2025",
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
    event: "bn-2025",
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
    event: "es-2025",
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
    status: "Unpaid",
    paymentDate: "",
    comment: "Marketing / Copywriting i teksty Burn on Tour x Mixmag PR"
  },
  {
    code: "02 - Burn Warsaw",
    event: "tf-2025",
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
    event: "boiler-room",
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
    status: "Processing",
    paymentDate: "",
    comment: "Artists payment"
  }
];

interface Invoice {
  code: string;
  event: string;
  supplier: string;
  invoiceNumber: string;
  taxNumber: string;
  vatId: string;
  bankAccount: string;
  bicSwift: string;
  operation: string;
  issueDate: string;
  dueDate: string;
  amountNet: string;
  vat: string;
  amountGross: string;
  currency: string;
  exchangeRate: string;
  amountPLN: string;
  status: string;
  paymentDate: string;
  comment: string;
}

const InvoiceTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(invoiceData);
  const [showComments, setShowComments] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Record<number, Invoice>>({});
  const { selectedEventId } = useEvent();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      filterInvoicesByEvent(selectedEventId);
    } else {
      const filtered = invoiceData.filter(
        (invoice) =>
          (invoice.supplier.toLowerCase().includes(term) ||
          invoice.invoiceNumber.toLowerCase().includes(term) ||
          invoice.comment.toLowerCase().includes(term) ||
          invoice.code.toLowerCase().includes(term)) &&
          (selectedEventId === "all" || invoice.event === selectedEventId)
      );
      setFilteredData(filtered);
    }
  };

  const filterInvoicesByEvent = (eventId: string) => {
    if (eventId === "all") {
      setFilteredData(invoiceData);
    } else {
      const filtered = invoiceData.filter(invoice => invoice.event === eventId);
      setFilteredData(filtered);
    }
  };

  React.useEffect(() => {
    filterInvoicesByEvent(selectedEventId);
  }, [selectedEventId]);

  const calculateTotal = () => {
    return filteredData
      .reduce((sum, invoice) => {
        const amount = parseFloat(invoice.amountPLN.replace(/,/g, ""));
        return isNaN(amount) ? sum : sum + amount;
      }, 0)
      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedValues({
      ...editedValues,
      [index]: { ...filteredData[index] }
    });
    toast.info(`Editing invoice ${filteredData[index].invoiceNumber}`);
  };

  const handleChange = (index: number, field: keyof Invoice, value: string) => {
    setEditedValues({
      ...editedValues,
      [index]: {
        ...editedValues[index],
        [field]: value
      }
    });
  };

  const handleStatusChange = (index: number, value: string) => {
    setEditedValues({
      ...editedValues,
      [index]: {
        ...editedValues[index],
        status: value
      }
    });
    
    const updatedData = [...filteredData];
    updatedData[index] = {
      ...updatedData[index],
      status: value
    };
    setFilteredData(updatedData);
    toast.success(`Invoice status updated to "${value}"`);
  };

  const handleSave = (index: number) => {
    toast.success(`Changes to invoice ${filteredData[index].invoiceNumber} saved successfully`);
    
    const updatedData = [...filteredData];
    updatedData[index] = editedValues[index];
    setFilteredData(updatedData);
    
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    setSelectedInvoice(index);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedInvoice !== null) {
      const updatedData = filteredData.filter((_, idx) => idx !== selectedInvoice);
      setFilteredData(updatedData);
      
      toast.success(`Invoice ${filteredData[selectedInvoice].invoiceNumber} deleted successfully`);
      setShowDeleteDialog(false);
    }
  };

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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={showComments ? "bg-muted" : ""}
            onClick={toggleComments}
          >
            {showComments ? "Hide Comments" : "Show Comments"}
          </Button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-end">
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
          <TableCaption>
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
              {showComments && <TableHead>Comments</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((invoice, index) => (
                <TableRow key={index} className="hover:bg-muted/60">
                  <TableCell className="font-medium">
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.code || invoice.code} 
                        onChange={(e) => handleChange(index, 'code', e.target.value)}
                      />
                    ) : (
                      invoice.code
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.supplier || invoice.supplier} 
                        onChange={(e) => handleChange(index, 'supplier', e.target.value)}
                      />
                    ) : (
                      invoice.supplier
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.invoiceNumber || invoice.invoiceNumber} 
                        onChange={(e) => handleChange(index, 'invoiceNumber', e.target.value)}
                      />
                    ) : (
                      invoice.invoiceNumber
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.issueDate || invoice.issueDate} 
                        onChange={(e) => handleChange(index, 'issueDate', e.target.value)}
                      />
                    ) : (
                      invoice.issueDate
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.dueDate || invoice.dueDate} 
                        onChange={(e) => handleChange(index, 'dueDate', e.target.value)}
                      />
                    ) : (
                      invoice.dueDate
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.amountGross || invoice.amountGross} 
                        onChange={(e) => handleChange(index, 'amountGross', e.target.value)}
                        className="text-right"
                      />
                    ) : (
                      invoice.amountGross
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.currency || invoice.currency} 
                        onChange={(e) => handleChange(index, 'currency', e.target.value)}
                      />
                    ) : (
                      invoice.currency
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.amountPLN || invoice.amountPLN} 
                        onChange={(e) => handleChange(index, 'amountPLN', e.target.value)}
                        className="text-right"
                      />
                    ) : (
                      invoice.amountPLN
                    )}
                  </TableCell>
                  <TableCell>
                    <ActionButtonDropdown
                      value={editingIndex === index ? editedValues[index]?.status || invoice.status : invoice.status}
                      options={invoiceStatusOptions}
                      onValueChange={(value) => handleStatusChange(index, value)}
                      isEditing={true}
                      showActions={false}
                      autoSave={true}
                      className="min-w-[120px]"
                    />
                  </TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input 
                        value={editedValues[index]?.paymentDate || invoice.paymentDate} 
                        onChange={(e) => handleChange(index, 'paymentDate', e.target.value)}
                      />
                    ) : (
                      invoice.paymentDate
                    )}
                  </TableCell>
                  {showComments && (
                    <TableCell>
                      {editingIndex === index ? (
                        <Input 
                          value={editedValues[index]?.comment || invoice.comment} 
                          onChange={(e) => handleChange(index, 'comment', e.target.value)}
                        />
                      ) : (
                        invoice.comment ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer">
                                  <Info className="h-4 w-4" />
                                  <span className="truncate max-w-[100px]">{invoice.comment}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-[300px]">{invoice.comment}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground">No comment</span>
                        )
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <ActionButtons
                      onEdit={() => handleEdit(index)}
                      onSave={() => handleSave(index)}
                      onDelete={() => handleDelete(index)}
                      isEditing={editingIndex === index}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showComments ? 12 : 11} className="text-center h-24">
                  No invoices found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice 
              {selectedInvoice !== null && filteredData[selectedInvoice] 
                ? ` "${filteredData[selectedInvoice].invoiceNumber}" from ${filteredData[selectedInvoice].supplier}` 
                : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceTable;
