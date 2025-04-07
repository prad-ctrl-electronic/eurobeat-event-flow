
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CircleDollarSign, FileText } from "lucide-react";
import { useStaffing } from "@/contexts/StaffingContext";

interface StaffMetricsProps {
  className?: string;
}

const StaffMetrics: React.FC<StaffMetricsProps> = ({ className = "" }) => {
  const { staff, filteredStaff } = useStaffing();

  const metrics = {
    totalStaff: filteredStaff.length,
    activeStaff: filteredStaff.filter(s => s.status === "active").length,
    pendingStaff: filteredStaff.filter(s => s.status === "pending").length,
    documentComplianceRate: calculateComplianceRate(filteredStaff)
  };

  function calculateComplianceRate(staffMembers: typeof staff): number {
    if (staffMembers.length === 0) return 0;
    
    const staffWithDocs = staffMembers.filter(member => 
      member.documentsCompliance && 
      Object.values(member.documentsCompliance).some(Boolean)
    );
    
    if (staffWithDocs.length === 0) return 0;
    
    const totalDocs = staffWithDocs.reduce((sum, member) => {
      const docValues = member.documentsCompliance ? Object.values(member.documentsCompliance) : [];
      return sum + docValues.length;
    }, 0);
    
    const compliantDocs = staffWithDocs.reduce((sum, member) => {
      const docValues = member.documentsCompliance ? Object.values(member.documentsCompliance) : [];
      return sum + docValues.filter(Boolean).length;
    }, 0);
    
    return totalDocs ? Math.round((compliantDocs / totalDocs) * 100) : 0;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`}>
      <Card className="card-gradient">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary-purple/20 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-primary-purple" />
          </div>
          <CardTitle className="text-2xl mb-1">{metrics.totalStaff}</CardTitle>
          <CardDescription>Total Staff</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-secondary-blue/20 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-secondary-blue" />
          </div>
          <CardTitle className="text-2xl mb-1">{metrics.activeStaff}</CardTitle>
          <CardDescription>Active Staff</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-accent-pink/20 flex items-center justify-center mb-4">
            <CircleDollarSign className="h-6 w-6 text-accent-pink" />
          </div>
          <CardTitle className="text-2xl mb-1">{metrics.pendingStaff}</CardTitle>
          <CardDescription>Pending Onboarding</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-accent-teal/20 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-accent-teal" />
          </div>
          <CardTitle className="text-2xl mb-1">{metrics.documentComplianceRate}%</CardTitle>
          <CardDescription>Document Compliance</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffMetrics;
