
import React from "react";
import { Task, TaskStatus } from "@/types/task";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800"
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  return (
    <Card className="shadow-sm hover:shadow transition-all">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{task.title}</h3>
          <Badge className={cn(priorityColors[task.priority])}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {task.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1.5 mt-4 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
          </div>
        )}
        
        {task.assignedTo && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{task.assignedTo}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Change Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onStatusChange("draft")}>
              Mark as Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("pending")}>
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("completed")}>
              Mark as Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
