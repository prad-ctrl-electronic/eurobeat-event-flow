
import React from "react";
import { AlertCircle, ChevronRight, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const financialTasks = [
  {
    id: 1,
    title: "VAT Report Due",
    description: "Q2 2025 VAT report needs to be submitted",
    deadline: "2025-04-15",
    priority: "high",
    category: "tax"
  },
  {
    id: 2,
    title: "Unpaid Invoice #INV-2025-042",
    description: "Follow up on Sound Equipment Ltd invoice",
    deadline: "2025-04-10",
    priority: "medium",
    category: "invoice"
  },
  {
    id: 3,
    title: "Expense Approval",
    description: "Venue booking deposit for Techno Fusion",
    deadline: "2025-04-09",
    priority: "low",
    category: "expense"
  }
];

const FinancialTasks = () => {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Financial Tasks</CardTitle>
            <CardDescription>Upcoming deadlines</CardDescription>
          </div>
          <Badge className="bg-accent-pink hover:bg-accent-pink/90">
            3 Urgent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {financialTasks.map((task) => (
          <div key={task.id} className="flex justify-between items-start border border-white/10 rounded-lg p-4 bg-muted/20">
            <div className="flex gap-3">
              {task.category === "tax" && (
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <AlertCircle className="h-5 w-5" />
                </div>
              )}
              {task.category === "invoice" && (
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <FileText className="h-5 w-5" />
                </div>
              )}
              {task.category === "expense" && (
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Due {new Date(task.deadline).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full">View All Tasks</Button>
      </CardContent>
    </Card>
  );
};

export default FinancialTasks;
