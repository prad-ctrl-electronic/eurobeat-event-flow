
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetFilterProps {
  searchTerm: string;
  filterCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categories?: string[];
}

const BudgetFilter = ({ 
  searchTerm, 
  filterCategory, 
  onSearchChange, 
  onCategoryChange,
  categories = [] // Provide default empty array
}: BudgetFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4">
      <div className="relative min-w-[200px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select
        value={filterCategory}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BudgetFilter;
