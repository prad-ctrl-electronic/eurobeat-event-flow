
export interface CostItem {
  id: string;
  category: string;
  description: string;
  planned: number;
  actual: number;
  variance: number;
  notes: string;
}

export interface RevenueItem {
  id: string;
  category: string;
  description: string;
  planned: number;
  actual: number;
  variance: number;
  notes: string;
}

// Sample budget data based on the CSV file
export const budgetData: CostItem[] = [
  {
    id: "1",
    category: "Venue",
    description: "Main Hall Rental",
    planned: 15000,
    actual: 16200,
    variance: -1200,
    notes: "Price increase due to extended hours"
  },
  {
    id: "2",
    category: "Technical",
    description: "Sound System",
    planned: 8500,
    actual: 8500,
    variance: 0,
    notes: "As per quote"
  },
  {
    id: "3",
    category: "Technical",
    description: "Lighting Equipment",
    planned: 6800,
    actual: 7200,
    variance: -400,
    notes: "Added extra fixtures"
  },
  {
    id: "4",
    category: "Artists",
    description: "Headliner Fee",
    planned: 25000,
    actual: 25000,
    variance: 0,
    notes: "Contract fulfilled"
  },
  {
    id: "5",
    category: "Artists",
    description: "Supporting Acts",
    planned: 12000,
    actual: 10800,
    variance: 1200,
    notes: "One act canceled, partial refund"
  },
  {
    id: "6",
    category: "Marketing",
    description: "Social Media Campaign",
    planned: 5000,
    actual: 6250,
    variance: -1250,
    notes: "Added extra promotion week"
  },
  {
    id: "7",
    category: "Staff",
    description: "Security Personnel",
    planned: 4500,
    actual: 4950,
    variance: -450,
    notes: "Added 3 extra guards"
  },
  {
    id: "8",
    category: "Staff",
    description: "Bar Staff",
    planned: 3800,
    actual: 3800,
    variance: 0,
    notes: "As planned"
  },
  {
    id: "9",
    category: "Permits",
    description: "Alcohol License",
    planned: 1200,
    actual: 1200,
    variance: 0,
    notes: "Standard fee"
  },
  {
    id: "10",
    category: "Miscellaneous",
    description: "Insurance",
    planned: 2800,
    actual: 2800,
    variance: 0,
    notes: "Annual policy"
  }
];

// Revenue data
export const revenueData: RevenueItem[] = [
  {
    id: "1",
    category: "Ticket Sales",
    description: "Pre-sale Tickets",
    planned: 45000,
    actual: 48200,
    variance: 3200,
    notes: "Higher than expected sales"
  },
  {
    id: "2",
    category: "Ticket Sales",
    description: "Door Sales",
    planned: 15000,
    actual: 12800,
    variance: -2200,
    notes: "Bad weather affected walk-ins"
  },
  {
    id: "3",
    category: "Bar",
    description: "Drink Sales",
    planned: 35000,
    actual: 42500,
    variance: 7500,
    notes: "Higher consumption than projected"
  },
  {
    id: "4",
    category: "Merchandise",
    description: "Event Merchandise",
    planned: 8000,
    actual: 9400,
    variance: 1400,
    notes: "New t-shirt design sold well"
  },
  {
    id: "5",
    category: "Sponsorships",
    description: "Main Sponsor",
    planned: 20000,
    actual: 20000,
    variance: 0,
    notes: "Contract fulfilled"
  }
];

export const getUniqueCategories = (): string[] => {
  return [...new Set([
    ...budgetData.map(item => item.category),
    ...revenueData.map(item => item.category)
  ])];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-EU', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2 
  }).format(amount);
};

export const getVarianceClass = (variance: number): string => {
  return variance < 0 
    ? "text-red-500" 
    : variance > 0 
      ? "text-green-500" 
      : "text-muted-foreground";
};

export const calculateSummary = () => {
  const totalPlannedCost = budgetData.reduce((sum, item) => sum + item.planned, 0);
  const totalActualCost = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalCostVariance = budgetData.reduce((sum, item) => sum + item.variance, 0);
  
  const totalPlannedRevenue = revenueData.reduce((sum, item) => sum + item.planned, 0);
  const totalActualRevenue = revenueData.reduce((sum, item) => sum + item.actual, 0);
  const totalRevenueVariance = revenueData.reduce((sum, item) => sum + item.variance, 0);
  
  const plannedProfit = totalPlannedRevenue - totalPlannedCost;
  const actualProfit = totalActualRevenue - totalActualCost;
  const profitVariance = totalRevenueVariance - totalCostVariance;
  
  const profitMarginPlanned = ((plannedProfit / totalPlannedRevenue) * 100).toFixed(2);
  const profitMarginActual = ((actualProfit / totalActualRevenue) * 100).toFixed(2);
  
  return {
    totalPlannedCost,
    totalActualCost,
    totalCostVariance,
    totalPlannedRevenue,
    totalActualRevenue,
    totalRevenueVariance,
    plannedProfit,
    actualProfit,
    profitVariance,
    profitMarginPlanned,
    profitMarginActual
  };
};
