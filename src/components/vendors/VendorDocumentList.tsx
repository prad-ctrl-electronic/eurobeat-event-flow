
import React from "react";
import { 
  Table, 
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, AlertTriangle } from "lucide-react";
import { vendorDocuments } from "@/data/vendorData";

interface VendorDocumentListProps {
  vendorId: string;
}

const VendorDocumentList: React.FC<VendorDocumentListProps> = ({ vendorId }) => {
  const documents = vendorDocuments.filter(doc => doc.vendorId === vendorId);
  
  const isExpiringSoon = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysDifference = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDifference <= 30 && daysDifference > 0;
  };
  
  const isExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    return expiry < today;
  };

  return (
    <div>
      {documents.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {doc.expiryDate ? (
                    <div className="flex items-center">
                      {isExpiringSoon(doc.expiryDate) && (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      )}
                      {isExpired(doc.expiryDate) ? (
                        <span className="text-red-500">
                          Expired: {new Date(doc.expiryDate).toLocaleDateString()}
                        </span>
                      ) : (
                        new Date(doc.expiryDate).toLocaleDateString()
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No expiry</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No documents uploaded</p>
        </div>
      )}
    </div>
  );
};

export default VendorDocumentList;
