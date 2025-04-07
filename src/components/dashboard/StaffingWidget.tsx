
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStaffing } from "@/contexts/StaffingContext";
import { useEvent } from "@/contexts/EventContext";

const StaffingWidget: React.FC = () => {
  const navigate = useNavigate();
  const { staff, departments } = useStaffing();
  const { selectedEventId } = useEvent();
  
  // Filter active staff
  const activeStaff = staff.filter(member => member.status === "active");
  
  // Get staff with incomplete documents
  const incompleteDocsStaff = staff.filter(member => 
    member.documentsCompliance && 
    Object.values(member.documentsCompliance).some(value => value === false)
  );
  
  // Calculate department staffing
  const departmentStaffing = departments.map(dept => {
    const count = staff.filter(member => member.department === dept.id).length;
    return {
      ...dept,
      count
    };
  }).sort((a, b) => b.count - a.count).slice(0, 3);
  
  const getDepartmentName = (departmentId: string | undefined): string => {
    if (!departmentId) return "Not Assigned";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown";
  };

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Staffing Overview</CardTitle>
        <CardDescription>
          {selectedEventId !== 'all' 
            ? "Staff for current event" 
            : "Overall staff status"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Latest Staff</h3>
            <div className="space-y-2">
              {activeStaff.slice(0, 3).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/20">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary-purple/20 text-primary-purple">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500">{getDepartmentName(member.department)}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Department Coverage</h3>
            <div className="space-y-2">
              {departmentStaffing.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between">
                  <p className="text-sm">{dept.name}</p>
                  <Badge variant="outline" className="bg-muted/20">{dept.count} staff</Badge>
                </div>
              ))}
            </div>
          </div>
          
          {incompleteDocsStaff.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-amber-500">Document Compliance Issues</h3>
              <p className="text-xs text-muted-foreground">
                {incompleteDocsStaff.length} staff {incompleteDocsStaff.length === 1 ? "member has" : "members have"} incomplete documentation
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => navigate('/staffing')}
        >
          Manage Staff
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffingWidget;
