
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

// Staff types
export interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
  initials: string;
  status: "active" | "inactive" | "pending";
  events: number;
  contract: string;
  nationality?: string;
  countryOfResidence?: string;
  taxId?: string;
  payrollType?: "B2B" | "UoD" | "UoP";
  agency?: string;
  rateType?: "Hourly" | "Daily" | "Flat";
  rateAmount?: number;
  currency?: string;
  bankInfo?: string;
  skills?: string[];
  languages?: string[];
  certifications?: string[];
  notes?: string;
  department?: string;
  preferredRoles?: string[];
  preferredCities?: string[];
  documentsCompliance?: Record<string, boolean>;
  documentsExpiry?: Record<string, string>;
  availability?: {
    blackoutDates: string[];
  };
  ratings?: {
    reliability: number;
    skill: number;
    punctuality: number;
    teamFit: number;
    communication: number;
    average: number;
    notes?: string;
  }[];
}

export interface StaffAssignment {
  id: string;
  staffId: number;
  eventId: string;
  role: string;
  department: string;
  shifts: Shift[];
  payDetails: {
    baseRate: number;
    currency: string;
    rateType: "Hourly" | "Daily" | "Flat";
    totalHours?: number;
    overtime?: number;
    perDiem?: number;
    travelReimbursement?: number;
    bonus?: number;
    vatApplicable?: boolean;
    vatPercent?: number;
    employerTaxes?: number;
    totalCost: number;
  };
  contractUrl?: string;
  responsibilities?: string;
  checkInStatus?: "Pending" | "Checked In" | "Checked Out" | "No Show";
  paymentStatus?: "Draft" | "Submitted" | "Approved" | "Paid";
  approvals?: {
    stage: string;
    approverId: number;
    status: "Pending" | "Approved" | "Rejected";
    timestamp?: string;
    comments?: string;
  }[];
  feedback?: {
    reliability: number;
    skill: number;
    punctuality: number;
    teamFit: number;
    communication: number;
    average: number;
    notes?: string;
  };
}

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  role?: string;
  location?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Department {
  id: string;
  name: string;
  coordinator?: number; // staffId of coordinator
}
