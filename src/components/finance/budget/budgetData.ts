
import { v4 as uuidv4 } from 'uuid';

export interface CostItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  event: string; // Add event field
  planned: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  notes?: string;
}

export interface RevenueItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  event: string; // Add event field
  planned: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  notes?: string;
  vatPercent?: number; // New field for VAT
}

export const calculateVariance = (planned: number, actual: number): number => {
  return actual - planned;
};

export const calculateVariancePercentage = (planned: number, actual: number): number => {
  if (planned === 0) {
    return actual === 0 ? 0 : Infinity;
  }
  return ((actual - planned) / planned) * 100;
};

export const addCostItem = (
  category: string,
  subcategory: string,
  description: string,
  event: string,
  planned: number,
  actual: number,
  notes?: string
): CostItem => {
  const variance = calculateVariance(planned, actual);
  const variancePercentage = calculateVariancePercentage(planned, actual);

  return {
    id: uuidv4(),
    category,
    subcategory,
    description,
    event,
    planned,
    actual,
    variance,
    variancePercentage,
    notes,
  };
};

export const addRevenueItem = (
  category: string,
  subcategory: string,
  description: string,
  event: string,
  planned: number,
  actual: number,
  notes?: string,
  vatPercent: number = 0
): RevenueItem => {
  const variance = calculateVariance(planned, actual);
  const variancePercentage = calculateVariancePercentage(planned, actual);

  return {
    id: uuidv4(),
    category,
    subcategory,
    description,
    event,
    planned,
    actual,
    variance,
    variancePercentage,
    notes,
    vatPercent,
  };
};

// Update sample data to include event field
export const costsData: CostItem[] = [
  {
    id: "c1",
    category: "Artist Fees",
    subcategory: "DJ",
    description: "Main headliner fee",
    event: "tf-2025",
    planned: 5000,
    actual: 5500,
    variance: -500,
    variancePercentage: -10,
    notes: "Rate increased due to recent chart success"
  },
  {
    id: "c2",
    category: "Venue Rental",
    subcategory: "Main Hall",
    description: "Rental fee for the main hall",
    event: "tf-2025",
    planned: 3000,
    actual: 3000,
    variance: 0,
    variancePercentage: 0
  },
  {
    id: "c3",
    category: "Marketing",
    subcategory: "Social Media Ads",
    description: "Advertising campaign on Facebook and Instagram",
    event: "tf-2025",
    planned: 1500,
    actual: 1200,
    variance: 300,
    variancePercentage: 20,
    notes: "Campaign was more efficient than expected"
  },
  {
    id: "c4",
    category: "Security",
    subcategory: "Guards",
    description: "Security personnel for the event",
    event: "tf-2025",
    planned: 2000,
    actual: 2200,
    variance: -200,
    variancePercentage: -10
  },
  {
    id: "c5",
    category: "Logistics",
    subcategory: "Transportation",
    description: "Transportation costs for equipment and staff",
    event: "tf-2025",
    planned: 800,
    actual: 750,
    variance: 50,
    variancePercentage: 6.25
  },
  {
    id: "c6",
    category: "Artist Fees",
    subcategory: "DJ",
    description: "Main headliner fee",
    event: "bn-2025",
    planned: 5000,
    actual: 5500,
    variance: -500,
    variancePercentage: -10,
    notes: "Rate increased due to recent chart success"
  },
  {
    id: "c7",
    category: "Venue Rental",
    subcategory: "Main Hall",
    description: "Rental fee for the main hall",
    event: "bn-2025",
    planned: 3000,
    actual: 3000,
    variance: 0,
    variancePercentage: 0
  },
  {
    id: "c8",
    category: "Marketing",
    subcategory: "Social Media Ads",
    description: "Advertising campaign on Facebook and Instagram",
    event: "bn-2025",
    planned: 1500,
    actual: 1200,
    variance: 300,
    variancePercentage: 20,
    notes: "Campaign was more efficient than expected"
  },
  {
    id: "c9",
    category: "Security",
    subcategory: "Guards",
    description: "Security personnel for the event",
    event: "bn-2025",
    planned: 2000,
    actual: 2200,
    variance: -200,
    variancePercentage: -10
  },
  {
    id: "c10",
    category: "Logistics",
    subcategory: "Transportation",
    description: "Transportation costs for equipment and staff",
    event: "bn-2025",
    planned: 800,
    actual: 750,
    variance: 50,
    variancePercentage: 6.25
  },
  {
    id: "c11",
    category: "Artist Fees",
    subcategory: "DJ",
    description: "Main headliner fee",
    event: "es-2025",
    planned: 5000,
    actual: 5500,
    variance: -500,
    variancePercentage: -10,
    notes: "Rate increased due to recent chart success"
  },
  {
    id: "c12",
    category: "Venue Rental",
    subcategory: "Main Hall",
    description: "Rental fee for the main hall",
    event: "es-2025",
    planned: 3000,
    actual: 3000,
    variance: 0,
    variancePercentage: 0
  },
  {
    id: "c13",
    category: "Marketing",
    subcategory: "Social Media Ads",
    description: "Advertising campaign on Facebook and Instagram",
    event: "es-2025",
    planned: 1500,
    actual: 1200,
    variance: 300,
    variancePercentage: 20,
    notes: "Campaign was more efficient than expected"
  },
  {
    id: "c14",
    category: "Security",
    subcategory: "Guards",
    description: "Security personnel for the event",
    event: "es-2025",
    planned: 2000,
    actual: 2200,
    variance: -200,
    variancePercentage: -10
  },
  {
    id: "c15",
    category: "Logistics",
    subcategory: "Transportation",
    description: "Transportation costs for equipment and staff",
    event: "es-2025",
    planned: 800,
    actual: 750,
    variance: 50,
    variancePercentage: 6.25
  },
  {
    id: "c16",
    category: "Artist Fees",
    subcategory: "DJ",
    description: "Main headliner fee",
    event: "boiler-room",
    planned: 5000,
    actual: 5500,
    variance: -500,
    variancePercentage: -10,
    notes: "Rate increased due to recent chart success"
  },
  {
    id: "c17",
    category: "Venue Rental",
    subcategory: "Main Hall",
    description: "Rental fee for the main hall",
    event: "boiler-room",
    planned: 3000,
    actual: 3000,
    variance: 0,
    variancePercentage: 0
  },
  {
    id: "c18",
    category: "Marketing",
    subcategory: "Social Media Ads",
    description: "Advertising campaign on Facebook and Instagram",
    event: "boiler-room",
    planned: 1500,
    actual: 1200,
    variance: 300,
    variancePercentage: 20,
    notes: "Campaign was more efficient than expected"
  },
  {
    id: "c19",
    category: "Security",
    subcategory: "Guards",
    description: "Security personnel for the event",
    event: "boiler-room",
    planned: 2000,
    actual: 2200,
    variance: -200,
    variancePercentage: -10
  },
  {
    id: "c20",
    category: "Logistics",
    subcategory: "Transportation",
    description: "Transportation costs for equipment and staff",
    event: "boiler-room",
    planned: 800,
    actual: 750,
    variance: 50,
    variancePercentage: 6.25
  },
];

// Add event field to other items in costsData

export const revenueData: RevenueItem[] = [
  {
    id: "r1",
    category: "Ticket Sales",
    subcategory: "Early Bird",
    description: "First batch tickets",
    event: "tf-2025",
    planned: 10000,
    actual: 12500,
    variance: 2500,
    variancePercentage: 25,
    vatPercent: 23
  },
  {
    id: "r2",
    category: "Sponsorship",
    subcategory: "Main Sponsor",
    description: "Sponsorship fee from main sponsor",
    event: "tf-2025",
    planned: 5000,
    actual: 5000,
    variance: 0,
    variancePercentage: 0,
    vatPercent: 0
  },
  {
    id: "r3",
    category: "Merchandise",
    subcategory: "T-Shirts",
    description: "Sales from T-shirts",
    event: "tf-2025",
    planned: 2000,
    actual: 2200,
    variance: 200,
    variancePercentage: 10,
    vatPercent: 23
  },
  {
    id: "r4",
    category: "Bar Sales",
    subcategory: "Alcohol",
    description: "Sales from alcohol",
    event: "tf-2025",
    planned: 4000,
    actual: 4500,
    variance: 500,
    variancePercentage: 12.5,
    vatPercent: 23
  },
  {
    id: "r5",
    category: "Food Sales",
    subcategory: "Snacks",
    description: "Sales from snacks",
    event: "tf-2025",
    planned: 1500,
    actual: 1600,
    variance: 100,
    variancePercentage: 6.67,
    vatPercent: 5
  },
  {
    id: "r6",
    category: "Ticket Sales",
    subcategory: "Early Bird",
    description: "First batch tickets",
    event: "bn-2025",
    planned: 10000,
    actual: 12500,
    variance: 2500,
    variancePercentage: 25,
    vatPercent: 23
  },
  {
    id: "r7",
    category: "Sponsorship",
    subcategory: "Main Sponsor",
    description: "Sponsorship fee from main sponsor",
    event: "bn-2025",
    planned: 5000,
    actual: 5000,
    variance: 0,
    variancePercentage: 0,
    vatPercent: 0
  },
  {
    id: "r8",
    category: "Merchandise",
    subcategory: "T-Shirts",
    description: "Sales from T-shirts",
    event: "bn-2025",
    planned: 2000,
    actual: 2200,
    variance: 200,
    variancePercentage: 10,
    vatPercent: 23
  },
  {
    id: "r9",
    category: "Bar Sales",
    subcategory: "Alcohol",
    description: "Sales from alcohol",
    event: "bn-2025",
    planned: 4000,
    actual: 4500,
    variance: 500,
    variancePercentage: 12.5,
    vatPercent: 23
  },
  {
    id: "r10",
    category: "Food Sales",
    subcategory: "Snacks",
    description: "Sales from snacks",
    event: "bn-2025",
    planned: 1500,
    actual: 1600,
    variance: 100,
    variancePercentage: 6.67,
    vatPercent: 5
  },
  {
    id: "r11",
    category: "Ticket Sales",
    subcategory: "Early Bird",
    description: "First batch tickets",
    event: "es-2025",
    planned: 10000,
    actual: 12500,
    variance: 2500,
    variancePercentage: 25,
    vatPercent: 23
  },
  {
    id: "r12",
    category: "Sponsorship",
    subcategory: "Main Sponsor",
    description: "Sponsorship fee from main sponsor",
    event: "es-2025",
    planned: 5000,
    actual: 5000,
    variance: 0,
    variancePercentage: 0,
    vatPercent: 0
  },
  {
    id: "r13",
    category: "Merchandise",
    subcategory: "T-Shirts",
    description: "Sales from T-shirts",
    event: "es-2025",
    planned: 2000,
    actual: 2200,
    variance: 200,
    variancePercentage: 10,
    vatPercent: 23
  },
  {
    id: "r14",
    category: "Bar Sales",
    subcategory: "Alcohol",
    description: "Sales from alcohol",
    event: "es-2025",
    planned: 4000,
    actual: 4500,
    variance: 500,
    variancePercentage: 12.5,
    vatPercent: 23
  },
  {
    id: "r15",
    category: "Food Sales",
    subcategory: "Snacks",
    description: "Sales from snacks",
    event: "es-2025",
    planned: 1500,
    actual: 1600,
    variance: 100,
    variancePercentage: 6.67,
    vatPercent: 5
  },
  {
    id: "r16",
    category: "Ticket Sales",
    subcategory: "Early Bird",
    description: "First batch tickets",
    event: "boiler-room",
    planned: 10000,
    actual: 12500,
    variance: 2500,
    variancePercentage: 25,
    vatPercent: 23
  },
  {
    id: "r17",
    category: "Sponsorship",
    subcategory: "Main Sponsor",
    description: "Sponsorship fee from main sponsor",
    event: "boiler-room",
    planned: 5000,
    actual: 5000,
    variance: 0,
    variancePercentage: 0,
    vatPercent: 0
  },
  {
    id: "r18",
    category: "Merchandise",
    subcategory: "T-Shirts",
    description: "Sales from T-shirts",
    event: "boiler-room",
    planned: 2000,
    actual: 2200,
    variance: 200,
    variancePercentage: 10,
    vatPercent: 23
  },
  {
    id: "r19",
    category: "Bar Sales",
    subcategory: "Alcohol",
    description: "Sales from alcohol",
    event: "boiler-room",
    planned: 4000,
    actual: 4500,
    variance: 500,
    variancePercentage: 12.5,
    vatPercent: 23
  },
  {
    id: "r20",
    category: "Food Sales",
    subcategory: "Snacks",
    description: "Sales from snacks",
    event: "boiler-room",
    planned: 1500,
    actual: 1600,
    variance: 100,
    variancePercentage: 6.67,
    vatPercent: 5
  },
];

// Add event field to other items in revenueData

// Export the arrays with their proper names
export const budgetData = costsData;

// Add the missing utility functions that are being imported by other components
export const getUniqueCategories = (): string[] => {
  const categories = new Set<string>();
  
  budgetData.forEach(item => {
    categories.add(item.category);
  });
  
  revenueData.forEach(item => {
    categories.add(item.category);
  });
  
  return Array.from(categories);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const getVarianceClass = (variance: number): string => {
  if (variance > 0) {
    return 'text-green-500';
  } else if (variance < 0) {
    return 'text-red-500';
  }
  return '';
};

export const calculateSummary = (eventId?: string) => {
  // Filter data based on eventId if provided
  const filteredCosts = eventId 
    ? budgetData.filter(item => item.event === eventId)
    : budgetData;
    
  const filteredRevenue = eventId 
    ? revenueData.filter(item => item.event === eventId)
    : revenueData;

  // Calculate totals
  const totalPlannedCost = filteredCosts.reduce((sum, item) => sum + item.planned, 0);
  const totalActualCost = filteredCosts.reduce((sum, item) => sum + item.actual, 0);
  const totalCostVariance = filteredCosts.reduce((sum, item) => sum + item.variance, 0);
  
  const totalPlannedRevenue = filteredRevenue.reduce((sum, item) => sum + item.planned, 0);
  const totalActualRevenue = filteredRevenue.reduce((sum, item) => sum + item.actual, 0);
  const totalRevenueVariance = filteredRevenue.reduce((sum, item) => sum + item.variance, 0);
  
  // Calculate profit figures
  const plannedProfit = totalPlannedRevenue - totalPlannedCost;
  const actualProfit = totalActualRevenue - totalActualCost;
  const profitVariance = actualProfit - plannedProfit;
  
  // Calculate profit margins
  const profitMarginPlanned = totalPlannedRevenue !== 0 
    ? ((plannedProfit / totalPlannedRevenue) * 100).toFixed(2)
    : "0.00";
    
  const profitMarginActual = totalActualRevenue !== 0 
    ? ((actualProfit / totalActualRevenue) * 100).toFixed(2)
    : "0.00";

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
