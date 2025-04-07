
export interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  vatId?: string;
  taxNumber?: string;
  serviceCategories: string[];
  servicesProvided?: string;
  notes?: string;
  status: VendorStatus;
  createdAt: string;
  rating?: VendorRating;
  verificationStatus: 'Pending' | 'Verified' | 'Blocked';
}

export type VendorStatus = 'Active' | 'Inactive' | 'Do Not Use' | 'New';

export interface VendorRating {
  reliability: number;
  quality: number;
  communication: number;
  budgetAdherence: number;
  rehireLikelihood: number;
  average: number;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  name: string;
  type: 'Contract' | 'Insurance' | 'NDA' | 'Invoice' | 'Payment' | 'Other';
  url: string;
  uploadDate: string;
  expiryDate?: string;
  notes?: string;
}

export interface VendorCommunication {
  id: string;
  vendorId: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Note';
  date: string;
  subject: string;
  content: string;
  attachmentUrl?: string;
  createdBy: string;
}

export interface VendorRefund {
  id: string;
  vendorId: string;
  eventId: string;
  date: string;
  amount: number;
  currency: string;
  reason: string;
  relatedInvoiceId?: string;
  status: 'Pending' | 'Processed' | 'Rejected';
}

export interface VendorAvailability {
  id: string;
  vendorId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface VendorAssignment {
  id: string;
  vendorId: string;
  eventId: string;
  role: string;
  budgetedAmount: number;
  actualAmount?: number;
  status: 'Assigned' | 'Confirmed' | 'Completed' | 'Canceled';
  notes?: string;
}

export interface ComplianceFlag {
  id: string;
  vendorId: string;
  type: 'Dispute' | 'Late Delivery' | 'Missing Documents' | 'Payment Issue' | 'Other';
  date: string;
  description: string;
  status: 'Active' | 'Resolved' | 'Reviewing';
  createdBy: string;
}
