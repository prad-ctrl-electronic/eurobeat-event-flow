
import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Mock initial data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the new admin dashboard layout',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high',
    assignedTo: 'Sarah Chen',
    project: 'Admin Dashboard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['design', 'ui/ux', 'wireframe']
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Set up OAuth2 authentication flow for the application',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Mike Johnson',
    project: 'User Auth',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['backend', 'security']
  },
  {
    id: '3',
    title: 'Create API documentation',
    description: 'Document all API endpoints and parameters',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    priority: 'low',
    assignedTo: null,
    project: 'API',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['documentation', 'api']
  },
  {
    id: '4',
    title: 'Fix responsive layout issues',
    description: 'Address layout problems on mobile devices',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    priority: 'high',
    assignedTo: 'Alex Torres',
    project: 'Frontend',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['bugfix', 'mobile', 'responsive']
  },
  {
    id: '5',
    title: 'Confirm venue booking',
    description: 'Contact venue manager to confirm date and requirements',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high',
    assignedTo: 'Lisa Wong',
    project: 'Techno Fusion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['event', 'logistics']
  },
  {
    id: '6',
    title: 'Finalize artist lineup',
    description: 'Confirm all artist contracts and travel arrangements',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    priority: 'medium',
    assignedTo: 'David Smith',
    project: 'Techno Fusion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['booking', 'artists']
  },
  {
    id: '7',
    title: 'Order sound equipment',
    description: 'Rent additional speakers and mixers for the main stage',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Mike Johnson',
    project: 'Techno Fusion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['equipment', 'audio']
  },
  {
    id: '8',
    title: 'Review marketing campaign',
    description: 'Analyze performance of social media ads and adjust strategy',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    priority: 'low',
    assignedTo: 'Sarah Chen',
    project: 'Marketing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['marketing', 'analytics']
  },
  {
    id: '9',
    title: 'Update website event calendar',
    description: 'Add all upcoming events to the public calendar with ticket links',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Alex Torres',
    project: 'Website',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['web', 'content']
  },
  {
    id: '10',
    title: 'Submit permit applications',
    description: 'Complete and submit all required city permits for the festival',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    priority: 'high',
    assignedTo: 'Lisa Wong',
    project: 'Burn Warsaw',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['legal', 'permits']
  },
  {
    id: '11',
    title: 'Coordinate security team',
    description: 'Finalize security staff schedule and emergency procedures',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high',
    assignedTo: 'David Smith',
    project: 'Burn Warsaw',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['security', 'staff']
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    const fetchTasks = () => {
      try {
        // Check if we have tasks in localStorage
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        } else {
          setTasks(initialTasks);
          localStorage.setItem('tasks', JSON.stringify(initialTasks));
        }
      } catch (error) {
        toast({
          title: "Error loading tasks",
          description: "There was a problem loading your tasks.",
          variant: "destructive",
        });
        setTasks(initialTasks);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [toast]);

  const addTask = (newTask: Task) => {
    // Ensure the task has an ID
    const taskWithId = {
      ...newTask,
      id: newTask.id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, taskWithId];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    
    toast({
      title: "Task created",
      description: "Your new task has been created successfully."
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === updatedTask.id ? {...updatedTask, updatedAt: new Date().toISOString()} : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully."
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully."
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status, updatedAt: new Date().toISOString() } 
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    
    toast({
      title: "Status updated",
      description: `Task status changed to ${status}.`
    });
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  };
};
