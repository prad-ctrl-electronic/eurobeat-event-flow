
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileDown, FileText } from "lucide-react";

// Sample task data
const sampleTasks = [
  {
    id: "task-001",
    title: "Finalize venue contract for Spring Festival",
    description: "Review contract terms and sign final agreement with venue management",
    status: "completed",
    priority: "high",
    dueDate: "2025-03-15",
    assignee: "Marcus Johnson",
    project: "Spring Festival 2025",
    category: "Venue"
  },
  {
    id: "task-002",
    title: "Book headline DJ for Techno Fusion",
    description: "Contact agent and negotiate performance fee",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-03-30",
    assignee: "Sophia Williams",
    project: "Techno Fusion",
    category: "Artist Booking"
  },
  {
    id: "task-003",
    title: "Order promotional materials for Burn Warsaw",
    description: "Design and order flyers, posters and online banners",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-04-10",
    assignee: "Emma Thompson",
    project: "Burn Warsaw",
    category: "Marketing"
  },
  {
    id: "task-004",
    title: "Submit permit applications for upcoming events",
    description: "Prepare and submit required documentation for city permits",
    status: "pending",
    priority: "high",
    dueDate: "2025-03-25",
    assignee: "David Wilson",
    project: "Multiple Events",
    category: "Administrative"
  },
  {
    id: "task-005",
    title: "Finalize security staff schedule for Boiler Room",
    description: "Coordinate with security company and confirm personnel",
    status: "completed",
    priority: "medium",
    dueDate: "2025-03-18",
    assignee: "Marcus Johnson",
    project: "Boiler Room",
    category: "Security"
  },
  {
    id: "task-006",
    title: "Set up ticket sales platform for Spring Festival",
    description: "Configure online ticketing system and test purchase flow",
    status: "pending",
    priority: "high",
    dueDate: "2025-04-01",
    assignee: "Emma Thompson",
    project: "Spring Festival 2025",
    category: "Tickets"
  },
  {
    id: "task-007",
    title: "Arrange transportation for Techno Fusion artists",
    description: "Book flights and local transport for all performers",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-04-05",
    assignee: "Sophia Williams",
    project: "Techno Fusion",
    category: "Logistics"
  },
  {
    id: "task-008",
    title: "Review and approve stage design for Burn Warsaw",
    description: "Evaluate proposed designs and select final layout",
    status: "completed",
    priority: "low",
    dueDate: "2025-03-20",
    assignee: "David Wilson",
    project: "Burn Warsaw",
    category: "Production"
  }
];

// Process data for chart
const getTasksByStatus = () => {
  const statusCounts = { completed: 0, "in-progress": 0, pending: 0 };
  
  sampleTasks.forEach(task => {
    if (statusCounts[task.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[task.status as keyof typeof statusCounts]++;
    }
  });
  
  return [
    { name: "Completed", value: statusCounts.completed },
    { name: "In Progress", value: statusCounts["in-progress"] },
    { name: "Pending", value: statusCounts.pending }
  ];
};

const getTasksByProject = () => {
  const projectCounts: Record<string, number> = {};
  
  sampleTasks.forEach(task => {
    if (!projectCounts[task.project]) {
      projectCounts[task.project] = 0;
    }
    projectCounts[task.project]++;
  });
  
  return Object.entries(projectCounts).map(([name, value]) => ({ name, value }));
};

const getTasksByPriority = () => {
  const priorityCounts: Record<string, number> = { high: 0, medium: 0, low: 0 };
  
  sampleTasks.forEach(task => {
    if (priorityCounts[task.priority]) {
      priorityCounts[task.priority]++;
    }
  });
  
  return [
    { name: "High", value: priorityCounts.high },
    { name: "Medium", value: priorityCounts.medium },
    { name: "Low", value: priorityCounts.low }
  ];
};

const TaskReport = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const filteredTasks = selectedProject
    ? sampleTasks.filter(task => task.project === selectedProject)
    : sampleTasks;
  
  const tasksByStatus = getTasksByStatus();
  const tasksByProject = getTasksByProject();
  const tasksByPriority = getTasksByPriority();
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      case "pending": return "outline";
      default: return "default";
    }
  };
  
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "default";
    }
  };
  
  const downloadTaskReport = () => {
    const reportData = {
      generatedDate: new Date().toISOString(),
      summary: {
        total: sampleTasks.length,
        completed: tasksByStatus.find(t => t.name === "Completed")?.value || 0,
        inProgress: tasksByStatus.find(t => t.name === "In Progress")?.value || 0,
        pending: tasksByStatus.find(t => t.name === "Pending")?.value || 0
      },
      byProject: Object.fromEntries(tasksByProject.map(({ name, value }) => [name, value])),
      byPriority: Object.fromEntries(tasksByPriority.map(({ name, value }) => [name, value])),
      tasks: filteredTasks
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Report</h2>
        <Button onClick={downloadTaskReport} variant="outline" size="sm" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTasks.length}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((tasksByStatus.find(t => t.name === "Completed")?.value || 0) / sampleTasks.length * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Tasks marked as complete</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksByPriority.find(t => t.name === "High")?.value || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  completed: { color: "#16a34a" },
                  inProgress: { color: "#3b82f6" },
                  pending: { color: "#d1d5db" }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Tasks" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksByProject}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Tasks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tasksByProject.map(project => (
                <Button 
                  key={project.name}
                  variant={selectedProject === project.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProject(selectedProject === project.name ? null : project.name)}
                >
                  {project.name} ({project.value})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Task List {selectedProject && `- ${selectedProject}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredTasks.map(task => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusVariant(task.status)}>
                      {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Assignee:</span> {task.assignee}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Project:</span> {task.project}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span> {task.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskReport;
