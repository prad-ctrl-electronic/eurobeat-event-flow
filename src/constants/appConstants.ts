
// Application-wide constants

// Status types
export const STATUS_TYPES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  DRAFT: "draft",
  COMPLETED: "completed",
  PAID: "paid",
  UNPAID: "unpaid",
  PROCESSING: "processing",
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
  APPROVED: "approved",
  REJECTED: "rejected",
  EXPIRED: "expired",
  SCHEDULED: "scheduled",
  CANCELED: "canceled",
  ARCHIVED: "archived",
};

// Priority levels
export const PRIORITY_LEVELS = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  CRITICAL: "critical",
};

// Contract types
export const CONTRACT_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time", 
  CONTRACTOR: "contractor",
  FREELANCE: "freelance",
  AGENCY: "agency",
  B2B: "B2B",
  UoP: "UoP",
  UoD: "UoD",
};

// Payment methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  CASH: "cash", 
  PAYPAL: "paypal",
  CRYPTO: "cryptocurrency",
};

// Common currency codes
export const CURRENCIES = {
  EUR: "EUR",
  USD: "USD",
  PLN: "PLN",
  GBP: "GBP",
};

// Date formats
export const DATE_FORMATS = {
  DEFAULT: "yyyy-MM-dd",
  DISPLAY: "dd MMM yyyy",
  SHORT: "dd/MM/yyyy",
  WITH_TIME: "yyyy-MM-dd HH:mm",
  HUMAN_READABLE: "MMMM dd, yyyy",
};

// Common time periods
export const TIME_PERIODS = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly", 
  YEARLY: "yearly",
};

// Common document types
export const DOCUMENT_TYPES = {
  CONTRACT: "contract",
  INVOICE: "invoice",
  RECEIPT: "receipt",
  ID: "identification",
  TAX_FORM: "tax_form",
  VISA: "visa", 
  WORK_PERMIT: "work_permit",
};

// Access roles
export const ACCESS_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  GUEST: "guest",
};
