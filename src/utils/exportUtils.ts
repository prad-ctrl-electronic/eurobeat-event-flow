import { toast } from "sonner";
import { formatCurrency } from "./financeUtils";

type ExportFormat = "excel" | "pdf";
type ExportModule = "finance" | "staffing" | "vendors" | "events" | "dashboard";
type ExportSubmodule = 
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

interface ExportOptions {
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

/**
 * Generate export file name based on export options
 */
export const generateExportFileName = (options: ExportOptions): string => {
  const { format, module, submodule, eventName, fileName } = options;
  
  // If custom filename is provided, use it
  if (fileName) return fileName;
  
  // Build file name from options
  const dateStr = new Date().toISOString().split('T')[0];
  const eventStr = eventName ? `-${eventName.replace(/\s+/g, '-').toLowerCase()}` : '';
  const submoduleStr = submodule ? `-${submodule}` : '';
  const extension = format === 'excel' ? '.xlsx' : '.pdf';
  
  return `${module}${submoduleStr}${eventStr}-${dateStr}${extension}`;
};

/**
 * Universal export function for any data
 */
export const exportData = async (data: any, options: ExportOptions): Promise<void> => {
  const { format, module, submodule } = options;
  const fileName = generateExportFileName(options);
  
  try {
    if (format === 'excel') {
      await exportToExcel(data, fileName, options);
    } else {
      await exportToPDF(data, fileName, options);
    }
    
    toast.success(`${capitalizeFirstLetter(submodule || module)} exported as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Export failed:', error);
    toast.error(`Failed to export as ${format.toUpperCase()}. Please try again.`);
  }
};

/**
 * Export data as Excel
 */
const exportToExcel = async (data: any, fileName: string, options: ExportOptions): Promise<void> => {
  // In a real implementation, we would use a library like SheetJS/ExcelJS
  // This is a placeholder that creates a JSON file instead
  
  // Prepare export metadata
  const exportMeta = {
    exportedAt: new Date().toISOString(),
    exportedBy: "Current User", // In real app, get from auth context
    module: options.module,
    submodule: options.submodule,
    filters: options.filters || {},
    data: data
  };
  
  // Create blob and trigger download
  const jsonString = JSON.stringify(exportMeta, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.replace('.xlsx', '.json'); // Temporary use JSON
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data as PDF
 */
const exportToPDF = async (data: any, fileName: string, options: ExportOptions): Promise<void> => {
  // In a real implementation, we would use a library like jsPDF or react-pdf
  // This is a placeholder that creates a JSON file instead
  
  // Prepare export metadata with PDF specific info
  const exportMeta = {
    exportedAt: new Date().toISOString(),
    exportedBy: "Current User", // In real app, get from auth context
    module: options.module,
    submodule: options.submodule,
    format: "PDF",
    orientation: guessOptimalOrientation(data),
    pageCount: Math.ceil(Array.isArray(data) ? data.length / 20 : 1),
    filters: options.filters || {},
    data: data
  };
  
  // Create blob and trigger download
  const jsonString = JSON.stringify(exportMeta, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.replace('.pdf', '.json'); // Temporary use JSON
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Guess optimal orientation based on data structure
 */
const guessOptimalOrientation = (data: any): 'portrait' | 'landscape' => {
  // If data is an array with objects that have many properties, use landscape
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    if (typeof firstItem === 'object' && Object.keys(firstItem).length > 5) {
      return 'landscape';
    }
  }
  return 'portrait';
};

/**
 * Format array of objects for Excel/PDF export
 */
export const formatTableDataForExport = (
  data: Record<string, any>[], 
  options: { 
    dateFields?: string[], 
    currencyFields?: string[],
    includeFields?: string[],
    excludeFields?: string[]
  } = {}
): Record<string, any>[] => {
  const { dateFields = [], currencyFields = [], includeFields, excludeFields = [] } = options;
  
  return data.map(row => {
    const formattedRow: Record<string, any> = {};
    
    // Filter fields based on include/exclude options
    Object.keys(row).forEach(key => {
      // Skip excluded fields
      if (excludeFields.includes(key)) return;
      
      // Skip if includeFields is specified and this field is not in it
      if (includeFields && !includeFields.includes(key)) return;
      
      let value = row[key];
      
      // Format date fields
      if (dateFields.includes(key) && value) {
        if (value instanceof Date) {
          value = value.toLocaleDateString();
        } else if (typeof value === 'string') {
          try {
            value = new Date(value).toLocaleDateString();
          } catch (e) {
            // Keep original value if not parsable as date
          }
        }
      }
      
      // Format currency fields
      if (currencyFields.includes(key) && typeof value === 'number') {
        value = formatCurrency(value);
      }
      
      formattedRow[key] = value;
    });
    
    return formattedRow;
  });
};

/**
 * Helper function to capitalize first letter
 */
const capitalizeFirstLetter = (string: string = ''): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Prepare data for export with headers and formatting
 */
export const prepareExportData = (
  data: any[],
  options: {
    headers?: Record<string, string>;  // Map field names to display names
    dateFields?: string[];
    currencyFields?: string[];
    includeFields?: string[];
    excludeFields?: string[];
  } = {}
) => {
  const { headers = {}, ...formatOptions } = options;
  
  // Format data
  const formattedData = formatTableDataForExport(data, formatOptions);
  
  // If headers are provided, transform field names to display names
  if (Object.keys(headers).length > 0) {
    return {
      headers: headers,
      data: formattedData
    };
  }
  
  return formattedData;
};
