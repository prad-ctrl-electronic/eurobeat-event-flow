
import { CostItem, RevenueItem } from './types';
import { costsData, revenueData } from './budgetMockData';

// Export the arrays with their proper names
export { costsData, revenueData };

// Export the types directly
export type { CostItem, RevenueItem };

// For backward compatibility
export const budgetData = costsData;

// Get unique categories from budget data
export const getUniqueCategories = (): string[] => {
  const categories = new Set<string>();
  
  costsData.forEach(item => {
    categories.add(item.category);
  });
  
  revenueData.forEach(item => {
    categories.add(item.category);
  });
  
  return Array.from(categories);
};

// Re-export key functions from budgetCalculations
export { 
  calculateVariance,
  calculateVariancePercentage,
  addCostItem,
  addRevenueItem,
  formatCurrency,
  getVarianceClass,
  calculateSummary
} from './budgetCalculations';
