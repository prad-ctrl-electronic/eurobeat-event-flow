
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  onValueChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing: boolean;
  className?: string;
  showActions?: boolean;
  autoSave?: boolean;
}

export const ActionButtonDropdown: React.FC<ActionButtonDropdownProps> = ({
  value,
  options,
  placeholder = "Select...",
  onValueChange,
  onSave,
  onCancel,
  isEditing,
  className = "",
  showActions = true,
  autoSave = false,
}) => {
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
    if (autoSave && onSave) {
      onSave();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={value} onValueChange={handleChange} disabled={!isEditing}>
        <SelectTrigger className={`${isEditing ? "" : "border-none bg-transparent pl-0"} w-full`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {isEditing && showActions && !autoSave && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSave}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4 text-muted-foreground hover:text-green-500" />
                  <span className="sr-only">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onCancel}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-amber-500" />
                  <span className="sr-only">Cancel</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};
