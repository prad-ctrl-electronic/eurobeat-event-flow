
import React, { useState } from "react";
import { AlertCircle, ChevronRight, FileText, Clock, CheckCircle2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionButtons } from "@/components/ui/action-buttons";
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

type FinancialTask = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  category: string;
};

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
  const [tasks, setTasks] = useState<FinancialTask[]>(financialTasks);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<number, FinancialTask>>({});

  const handleEdit = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditedValues({
        ...editedValues,
        [taskId]: { ...task }
      });
      setEditingTaskId(taskId);
    }
  };

  const handleChange = (taskId: number, field: keyof FinancialTask, value: string) => {
    setEditedValues({
      ...editedValues,
      [taskId]: {
        ...editedValues[taskId],
        [field]: value
      }
    });
  };

  const handleSave = (taskId: number) => {
    // In a real app, this would save to the database
    // For the demo, update the local state
    setTasks(tasks.map(task => 
      task.id === taskId ? editedValues[taskId] : task
    ));
    
    toast.success(`Task ${taskId} saved successfully`);
    setEditingTaskId(null);
  };

  const handleDelete = (taskId: number) => {
    setSelectedTask(taskId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedTask !== null) {
      setTasks(tasks.filter(task => task.id !== selectedTask));
      toast.success(`Task ${selectedTask} deleted successfully`);
      setShowDeleteDialog(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tax":
        return <AlertCircle className="h-5 w-5" />;
      case "invoice":
        return <FileText className="h-5 w-5" />;
      case "expense":
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tax":
        return "bg-amber-500/20 text-amber-500";
      case "invoice":
        return "bg-blue-500/20 text-blue-500";
      case "expense":
      default:
        return "bg-emerald-500/20 text-emerald-500";
    }
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Financial Tasks</CardTitle>
            <CardDescription>Upcoming deadlines</CardDescription>
          </div>
          <Badge className="bg-accent-pink hover:bg-accent-pink/90">
            {tasks.length} Urgent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex justify-between items-start border border-white/10 rounded-lg p-4 bg-muted/20">
            {editingTaskId === task.id ? (
              <div className="flex-1 space-y-2">
                <Input 
                  value={editedValues[task.id]?.title || task.title}
                  onChange={(e) => handleChange(task.id, 'title', e.target.value)}
                  placeholder="Task title"
                  className="font-medium"
                />
                <Textarea
                  value={editedValues[task.id]?.description || task.description}
                  onChange={(e) => handleChange(task.id, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
                    <Input 
                      type="date"
                      value={editedValues[task.id]?.deadline || task.deadline}
                      onChange={(e) => handleChange(task.id, 'deadline', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                    <Select
                      value={editedValues[task.id]?.category || task.category}
                      onValueChange={(value) => handleChange(task.id, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tax">Tax</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
                    <Select
                      value={editedValues[task.id]?.priority || task.priority}
                      onValueChange={(value) => handleChange(task.id, 'priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className={`h-10 w-10 rounded-full ${getCategoryColor(task.category)} flex items-center justify-center`}>
                  {getCategoryIcon(task.category)}
                </div>
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
            )}
            <div className="flex items-center gap-2">
              <ActionButtons
                onEdit={() => handleEdit(task.id)}
                onSave={() => handleSave(task.id)}
                onDelete={() => handleDelete(task.id)}
                isEditing={editingTaskId === task.id}
              />
              {!editingTaskId && (
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
              {editingTaskId === task.id && (
                <Button variant="ghost" size="icon" onClick={() => setEditingTaskId(null)}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full">View All Tasks</Button>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the financial task
              {selectedTask !== null && tasks.find(t => t.id === selectedTask) 
                ? ` "${tasks.find(t => t.id === selectedTask)?.title}"` 
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
    </Card>
  );
};

export default FinancialTasks;
