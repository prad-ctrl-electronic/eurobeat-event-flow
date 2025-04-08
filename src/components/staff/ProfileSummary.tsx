
import React from "react";
import { StaffMember } from "@/components/finance/budget/types";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Flag, 
} from "lucide-react";
import { format } from "date-fns";

interface ProfileSummaryProps {
  staffMember: StaffMember;
  getDepartmentName: (departmentId: string | undefined) => string;
}

const ProfileSummary = ({ staffMember, getDepartmentName }: ProfileSummaryProps) => {
  // Calculate compliance percentage
  const documentCount = staffMember.documentsCompliance ? Object.keys(staffMember.documentsCompliance).length : 0;
  const compliantDocCount = staffMember.documentsCompliance ? 
    Object.values(staffMember.documentsCompliance).filter(Boolean).length : 0;
  const compliancePercentage = documentCount > 0 ? 
    Math.round((compliantDocCount / documentCount) * 100) : 0;
    
  const upcomingDocExpiry = staffMember.documentsExpiry ? 
    Object.entries(staffMember.documentsExpiry)
      .filter(([_, date]) => new Date(date) > new Date())
      .sort(([_, dateA], [__, dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())[0] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      <Card className="col-span-1 card-gradient">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Profile</CardTitle>
            <Badge className={
              staffMember.status === "active" ? "bg-emerald-500" : 
              staffMember.status === "pending" ? "bg-amber-500" : 
              "bg-slate-500"
            }>
              {staffMember.status === "active" ? "Active" : 
               staffMember.status === "pending" ? "Pending" : 
               "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 border border-white/10 mb-4">
              <AvatarFallback className="bg-primary-purple/20 text-primary-purple text-2xl">
                {staffMember.initials}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold">{staffMember.name}</h2>
            <p className="text-muted-foreground mb-4">{staffMember.role}</p>
            
            <div className="w-full space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{staffMember.email}</span>
              </div>
              
              {staffMember.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{staffMember.phone}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {getDepartmentName(staffMember.department)}
                </span>
              </div>
              
              {staffMember.nationality && (
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{staffMember.nationality}</span>
                </div>
              )}
              
              {staffMember.countryOfResidence && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{staffMember.countryOfResidence}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-3 card-gradient">
        <CardHeader>
          <CardTitle>Staff Summary</CardTitle>
          <CardDescription>
            Overview of {staffMember.name}'s contract and payroll information
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contract Type</h3>
                <p className="font-medium">{staffMember.contract}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payroll Type</h3>
                <p className="font-medium">{staffMember.payrollType || "Not specified"}</p>
              </div>
              
              {staffMember.agency && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Agency</h3>
                  <p className="font-medium">{staffMember.agency}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rate Type</h3>
                <p className="font-medium">{staffMember.rateType || "Not specified"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rate Amount</h3>
                <p className="font-medium">
                  {staffMember.rateAmount 
                    ? `${staffMember.rateAmount} ${staffMember.currency || ''}` 
                    : "Not specified"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tax ID</h3>
                <p className="font-medium">{staffMember.taxId || "Not specified"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Events Count</h3>
                <p className="font-medium">{staffMember.events}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Document Compliance</h3>
                <p className="font-medium">
                  {compliancePercentage}% Complete 
                  ({compliantDocCount}/{documentCount})
                </p>
              </div>
              
              {upcomingDocExpiry && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Next Document Expiry</h3>
                  <p className="font-medium">
                    {upcomingDocExpiry[0]}: {format(new Date(upcomingDocExpiry[1]), "dd MMM yyyy")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSummary;
