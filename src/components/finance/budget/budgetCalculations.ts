
import { CostItem, RevenueItem } from './types';

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
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
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
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
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

export const calculateSummary = (costsData: CostItem[], revenueData: RevenueItem[], eventId?: string) => {
  // Filter data based on eventId if provided
  const filteredCosts = eventId 
    ? costsData.filter(item => item.event === eventId)
    : costsData;
    
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
