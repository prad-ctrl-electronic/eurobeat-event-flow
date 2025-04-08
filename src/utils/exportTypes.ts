
// Shared export types
export type ExportFormat = "excel" | "pdf";
export type ExportModule = "finance" | "staffing" | "vendors" | "events" | "dashboard";
export type ExportSubmodule = 
  | "invoices" 
  | "taxes" 
  | "budgeting" 
  | "reports"
  | "employees"
  | "contracts"
  | "salaries"
  | "vendor-invoices"
  | "vendor-contracts"
  | "vendor-payments"
  | "lineups"
  | "logistics"
  | "scheduling"
  | "bookings"
  | "summaries"
  | "analytics"
  | "tax-overview"
  | "expenses";

export interface ExportOptions {
  format: ExportFormat;
  module: ExportModule;
  submodule?: ExportSubmodule;
  eventId?: string;
  eventName?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  selectedRows?: string[];
  exportAll?: boolean;
  includeHeaders?: boolean;
  fileName?: string;
}
