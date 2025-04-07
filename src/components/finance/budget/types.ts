
import { v4 as uuidv4 } from 'uuid';

export interface CostItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  event: string;
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
  event: string;
  planned: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  notes?: string;
  vatPercent?: number;
}
