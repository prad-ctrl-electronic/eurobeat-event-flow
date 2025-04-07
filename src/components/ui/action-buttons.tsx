
import React from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  size?: "default" | "sm" | "lg" | "icon";
  isEditing?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onSave,
  size = "sm",
  isEditing = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {!isEditing && onEdit && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onEdit}
                variant="ghost"
                size={size}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                <span className="sr-only">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {isEditing && onSave && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSave}
                variant="ghost"
                size={size}
                className="h-8 w-8 p-0"
              >
                <Save className="h-4 w-4 text-muted-foreground hover:text-green-500" />
                <span className="sr-only">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {onDelete && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onDelete}
                variant="ghost"
                size={size}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
