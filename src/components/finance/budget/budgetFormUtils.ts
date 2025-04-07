
import { CostItem, RevenueItem } from "./budgetData";
import { Dispatch, SetStateAction } from "react";

export const handleCostChange = (
  field: keyof CostItem,
  value: any,
  newCostItem: Partial<CostItem>,
  setNewCostItem: Dispatch<SetStateAction<Partial<CostItem>>>
) => {
  setNewCostItem(prev => {
    const updated = { ...prev, [field]: value };
    
    if (field === 'planned' || field === 'actual') {
      const planned = field === 'planned' ? parseFloat(value) || 0 : parseFloat(prev.planned as any) || 0;
      const actual = field === 'actual' ? parseFloat(value) || 0 : parseFloat(prev.actual as any) || 0;
      updated.variance = planned - actual;
    }
    
    return updated;
  });
};

export const handleRevenueChange = (
  field: keyof RevenueItem,
  value: any,
  newRevenueItem: Partial<RevenueItem>,
  setNewRevenueItem: Dispatch<SetStateAction<Partial<RevenueItem>>>
) => {
  setNewRevenueItem(prev => {
    const updated = { ...prev, [field]: value };
    
    if (field === 'planned' || field === 'actual') {
      const planned = field === 'planned' ? parseFloat(value) || 0 : parseFloat(prev.planned as any) || 0;
      const actual = field === 'actual' ? parseFloat(value) || 0 : parseFloat(prev.actual as any) || 0;
      updated.variance = planned - actual;
    }
    
    return updated;
  });
};
