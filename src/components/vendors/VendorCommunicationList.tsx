
import React from "react";
import { vendorCommunications } from "@/data/vendorData";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  Users, 
  MessageSquare,
  Clock,
  Download,
  User,
} from "lucide-react";

interface VendorCommunicationListProps {
  vendorId: string;
}

const VendorCommunicationList: React.FC<VendorCommunicationListProps> = ({ vendorId }) => {
  const communications = vendorCommunications.filter(comm => comm.vendorId === vendorId);
  
  // Get icon based on communication type
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  // Get badge color based on communication type
  const getTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case 'call':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'meeting':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      {communications.length > 0 ? (
        communications.map((comm) => (
          <div key={comm.id} className="border rounded-md p-4 hover:bg-muted/40 transition-colors">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={getTypeBadgeClass(comm.type)}
                  >
                    <span className="flex items-center gap-2">
                      {getTypeIcon(comm.type)}
                      {comm.type}
                    </span>
                  </Badge>
                  <h4 className="font-medium">{comm.subject}</h4>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Clock className="h-3 w-3" />
                  {new Date(comm.date).toLocaleString()}
                  <span className="mx-1">•</span>
                  <User className="h-3 w-3" />
                  {comm.createdBy}
                </div>
              </div>
              {comm.attachmentUrl && (
                <div className="mt-2 md:mt-0">
                  <Badge variant="outline" className="gap-1 cursor-pointer">
                    <Download className="h-3 w-3" />
                    Attachment
                  </Badge>
                </div>
              )}
            </div>
            <div className="mt-2 text-sm whitespace-pre-line">{comm.content}</div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 border rounded-md">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No communication history</p>
        </div>
      )}
    </div>
  );
};

export default VendorCommunicationList;
