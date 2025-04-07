
import React from "react";
import { Task, TaskStatus } from "@/types/task";
import TaskCard from "./TaskCard";
import { Check, Clock, File } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  status: TaskStatus;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "completed":
      return <Check className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "draft":
      return <File className="h-4 w-4" />;
  }
};

const getStatusTitle = (status: TaskStatus): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "pending":
      return "In Progress";
    case "draft":
      return "Drafts";
  }
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  status,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const filteredTasks = tasks.filter(task => task.status === status);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 font-medium text-lg">
        {getStatusIcon(status)}
        <span>{getStatusTitle(status)}</span>
        <span className="text-sm text-muted-foreground ml-2">
          ({filteredTasks.length})
        </span>
      </div>
      
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={() => onEdit(task)} 
              onDelete={() => onDelete(task.id)}
              onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
            />
          ))
        ) : (
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground">No tasks in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
