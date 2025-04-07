
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chart } from "@/components/ui/chart";
import { useTasks } from "@/hooks/useTasks";
import { FileDown, Printer } from "lucide-react";

const TaskReport = () => {
  const { tasks, loading } = useTasks();
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending').length,
    draft: tasks.filter(t => t.status === 'draft').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };
  
  const tasksByPriority = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };
  
  // Group tasks by project
  const tasksByProject: {[key: string]: number} = {};
  tasks.forEach(task => {
    if (task.project) {
      tasksByProject[task.project] = (tasksByProject[task.project] || 0) + 1;
    }
  });
  
  const statusChartData = [
    { name: 'Pending', value: tasksByStatus.pending, fill: '#f59e0b' },
    { name: 'Draft', value: tasksByStatus.draft, fill: '#64748b' },
    { name: 'Completed', value: tasksByStatus.completed, fill: '#22c55e' },
  ];
  
  const priorityChartData = [
    { name: 'High', value: tasksByPriority.high, fill: '#ef4444' },
    { name: 'Medium', value: tasksByPriority.medium, fill: '#f59e0b' },
    { name: 'Low', value: tasksByPriority.low, fill: '#3b82f6' },
  ];
  
  const projectChartData = Object.entries(tasksByProject).map(([name, value]) => ({
    name,
    value,
    fill: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }));
  
  const downloadTaskReport = () => {
    // Create report data
    const reportData = {
      reportDate: new Date().toISOString(),
      generatedBy: "System",
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      tasksByProject,
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        project: task.project,
        dueDate: task.dueDate
      }))
    };
    
    // Convert to JSON
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `task-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading task data...</div>;
  }
  
  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Task Analysis Report</CardTitle>
          <CardDescription>Overview of task progress and distribution</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={downloadTaskReport}>
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Task Status</h3>
            <div className="h-[200px]">
              <Chart 
                data={statusChartData} 
                type="pie" 
                dataKey="value" 
                nameKey="name"
                legendPosition="bottom"
              />
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Task Priority</h3>
            <div className="h-[200px]">
              <Chart 
                data={priorityChartData} 
                type="pie" 
                dataKey="value" 
                nameKey="name"
                legendPosition="bottom"
              />
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Tasks by Project</h3>
            <div className="h-[200px]">
              <Chart 
                data={projectChartData} 
                type="pie" 
                dataKey="value" 
                nameKey="name"
                legendPosition="bottom"
              />
            </div>
          </div>
        </div>
        
        <h3 className="font-medium mb-4">Task Details</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.project || 'Unassigned'}</TableCell>
                <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                <TableCell>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 'outline'
                  }>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    task.status === 'completed' ? 'success' : 
                    task.status === 'pending' ? 'warning' : 'secondary'
                  } className={
                    task.status === 'completed' ? 'bg-green-500' : 
                    task.status === 'pending' ? 'bg-amber-500' : ''
                  }>
                    {task.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskReport;
