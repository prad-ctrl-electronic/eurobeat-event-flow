
import React, { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus, FileDown } from "lucide-react";
import { Task } from "@/types/task";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import { useTasks } from "@/hooks/useTasks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const TasksPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const { tasks, loading, addTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<{type: 'all' | 'project' | 'assignee', value: string}>({
    type: 'all',
    value: 'All Tasks'
  });

  useEffect(() => {
    if (activeFilter.type === 'all') {
      setFilteredTasks(tasks);
    } else if (activeFilter.type === 'project') {
      setFilteredTasks(tasks.filter(task => task.project === activeFilter.value));
    } else if (activeFilter.type === 'assignee') {
      setFilteredTasks(tasks.filter(task => task.assignedTo === activeFilter.value));
    }
  }, [tasks, activeFilter]);

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (task: Task) => {
    if (selectedTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
  };

  const generateTaskReport = () => {
    // Create report data
    const reportData = {
      reportDate: new Date().toISOString(),
      generatedBy: "System",
      totalTasks: filteredTasks.length,
      tasksByStatus: {
        draft: filteredTasks.filter(t => t.status === 'draft').length,
        pending: filteredTasks.filter(t => t.status === 'pending').length,
        completed: filteredTasks.filter(t => t.status === 'completed').length,
      },
      tasksByPriority: {
        high: filteredTasks.filter(t => t.priority === 'high').length,
        medium: filteredTasks.filter(t => t.priority === 'medium').length,
        low: filteredTasks.filter(t => t.priority === 'low').length,
      },
      tasks: filteredTasks.map(task => ({
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateTaskReport}>
                <FileDown className="mr-2 h-4 w-4" /> Export Report
              </Button>
              <Button onClick={handleAddTask}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="#" 
                    onClick={() => setActiveFilter({type: 'all', value: 'All Tasks'})}
                    className={`${navigationMenuTriggerStyle()} ${activeFilter.type === 'all' ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    All Tasks
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Filter by Project</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {Array.from(new Set(tasks.map(task => task.project))).filter(Boolean).map(project => (
                        <li key={project}>
                          <NavigationMenuLink asChild>
                            <a
                              href="#"
                              onClick={() => setActiveFilter({type: 'project', value: project!})}
                              className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${activeFilter.type === 'project' && activeFilter.value === project ? 'bg-accent text-accent-foreground' : ''}`}
                            >
                              <div className="text-sm font-medium leading-none">{project}</div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Filter by Assigned</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {Array.from(new Set(tasks.map(task => task.assignedTo))).filter(Boolean).map(assignee => (
                        <li key={assignee}>
                          <NavigationMenuLink asChild>
                            <a
                              href="#"
                              onClick={() => setActiveFilter({type: 'assignee', value: assignee!})}
                              className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${activeFilter.type === 'assignee' && activeFilter.value === assignee ? 'bg-accent text-accent-foreground' : ''}`}
                            >
                              <div className="text-sm font-medium leading-none">{assignee}</div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {loading ? (
            <div className="grid place-items-center h-48">
              <span className="text-muted-foreground">Loading tasks...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskList
                tasks={filteredTasks}
                status="pending"
                onEdit={handleEditTask}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
              />
              <TaskList
                tasks={filteredTasks}
                status="draft"
                onEdit={handleEditTask}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
              />
              <TaskList
                tasks={filteredTasks}
                status="completed"
                onEdit={handleEditTask}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
              />
            </div>
          )}

          <TaskForm
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedTask}
          />
        </main>
      </div>
    </div>
  );
};

export default TasksPage;
