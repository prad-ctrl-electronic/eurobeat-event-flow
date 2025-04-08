
// Basic shared entity interfaces for global state management

export interface BaseEntity {
  id: string | number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event extends BaseEntity {
  name: string;
  location: string;
  date: string;
  time: string;
  capacity: string;
  revenue: string;
  status: string;
  description?: string;
}

export interface Expense extends BaseEntity {
  date: string;
  vendor: string;
  description: string;
  category: string;
  amount: number;
  status: string;
  paymentMethod: string;
  event: string;
}

export interface Vendor extends BaseEntity {
  name: string;
  serviceCategories: string[];
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface StaffMember extends BaseEntity {
  name: string;
  initials: string;
  role: string;
  email: string;
  phone?: string;
  status: string;
  department?: string;
  payrollType?: string;
  contract?: string;
  rateType?: string;
  rateAmount?: number;
  currency?: string;
  nationality?: string;
  countryOfResidence?: string;
  taxId?: string;
  agency?: string;
  events: number;
  documentsCompliance?: Record<string, boolean>;
  documentsExpiry?: Record<string, string>;
}

export interface CostItem extends BaseEntity {
  category: string;
  description: string;
  planned: number; 
  actual: number;
  event: string;
}

export interface RevenueItem extends BaseEntity {
  category: string;
  description: string;
  planned: number;
  actual: number;
  event: string;
}

// Operation types for entity actions
export type EntityType = 'event' | 'expense' | 'vendor' | 'staffMember' | 'costItem' | 'revenueItem';

export type EntityAction<T> = 
  | { type: 'ADD'; payload: T }
  | { type: 'UPDATE'; id: string | number; payload: Partial<T> }
  | { type: 'DELETE'; id: string | number }
  | { type: 'SOFT_DELETE'; id: string | number }
  | { type: 'RESTORE'; id: string | number }
  | { type: 'SET'; payload: T[] };

// Notification types for operation feedback
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  timestamp: number;
}
