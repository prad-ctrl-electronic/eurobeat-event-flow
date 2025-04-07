
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, Tag, FileText, Check, X, AlertTriangle } from "lucide-react";
import { Vendor } from "@/types/vendor";
import { getVendorStatistics } from "@/data/vendorData";

interface VendorCardProps {
  vendor: Vendor;
  onClick?: () => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick }) => {
  const stats = getVendorStatistics(vendor.id);
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "Do Not Use": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "New": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  // Get verification status icon
  const getVerificationIcon = (status: string) => {
    switch(status) {
      case "Verified": return <Check className="h-4 w-4 text-green-500" />;
      case "Blocked": return <X className="h-4 w-4 text-red-500" />;
      case "Pending": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight">{vendor.name}</h3>
            {vendor.contactName && <p className="text-sm text-muted-foreground">{vendor.contactName}</p>}
          </div>
          <div className="flex items-center gap-1">
            {getVerificationIcon(vendor.verificationStatus)}
            <Badge variant="secondary" className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-2">
        <div className="flex flex-wrap gap-1">
          {vendor.serviceCategories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        
        {(vendor.email || vendor.phone) && (
          <div className="space-y-1 text-sm">
            {vendor.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{vendor.email}</span>
              </div>
            )}
            {vendor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{vendor.phone}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Total Invoices</p>
            <p className="font-medium">{stats.totalInvoices}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Events</p>
            <p className="font-medium">{stats.eventsWorkedOn}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Paid</p>
            <p className="font-medium">PLN {stats.totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Outstanding</p>
            <p className="font-medium">PLN {stats.outstandingBalance.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Added: {new Date(vendor.createdAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;
