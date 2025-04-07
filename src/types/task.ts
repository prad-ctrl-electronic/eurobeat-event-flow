
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: 'draft' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string | null;
  project: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type TaskStatus = 'draft' | 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
