
import React from "react";
import { StaffMember } from "@/components/finance/budget/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  UserCheck 
} from "lucide-react";
import { toast } from "sonner";

interface ProfileTabsProps {
  staffMember: StaffMember;
}

const ProfileTabs = ({ staffMember }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="assignments" className="space-y-6">
      <TabsList className="bg-muted/40">
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>
      
      <TabsContent value="assignments">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Event Assignments</CardTitle>
            <CardDescription>
              View and manage event assignments for {staffMember.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No assignments found</p>
              <Button onClick={() => toast.info("Assignment feature coming soon")}>
                Create Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="documents">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Track and manage required documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">Document management coming soon</p>
              <Button onClick={() => toast.info("Document upload feature coming soon")}>
                Upload Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="payments">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              View and manage payments for {staffMember.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No payment history found</p>
              <Button onClick={() => toast.info("Payment feature coming soon")}>
                Create Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="availability">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>
              View and manage availability for {staffMember.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">Availability calendar coming soon</p>
              <Button onClick={() => toast.info("Availability calendar feature coming soon")}>
                Set Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="feedback">
        <FeedbackTab staffMember={staffMember} />
      </TabsContent>
    </Tabs>
  );
};

const FeedbackTab = ({ staffMember }: { staffMember: StaffMember }) => {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Performance Feedback</CardTitle>
        <CardDescription>
          View and manage feedback for {staffMember.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {staffMember.ratings && staffMember.ratings.length > 0 ? (
          <div className="space-y-4">
            {staffMember.ratings.map((rating, index) => (
              <div key={index} className="border border-white/10 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">Reliability</h3>
                    <p className="font-medium">{rating.reliability}/5</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Skill</h3>
                    <p className="font-medium">{rating.skill}/5</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Punctuality</h3>
                    <p className="font-medium">{rating.punctuality}/5</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Team Fit</h3>
                    <p className="font-medium">{rating.teamFit}/5</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Communication</h3>
                    <p className="font-medium">{rating.communication}/5</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm text-muted-foreground">Average Rating</h3>
                    <p className="font-medium">{rating.average.toFixed(1)}/5</p>
                  </div>
                  {rating.notes && (
                    <div className="text-sm">
                      <p className="italic">{rating.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <UserCheck className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No feedback available yet</p>
            <Button onClick={() => toast.info("Feedback feature coming soon")}>
              Add Feedback
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileTabs;
