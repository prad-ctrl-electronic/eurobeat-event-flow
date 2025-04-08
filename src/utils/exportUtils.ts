
// Export utils - provides functionality to export data to various formats

import { formatCurrency } from './financeUtils';
import { BaseEntity } from '@/types/entities';

// Define modules that can be exported
export type ExportModule = 'finance' | 'staffing' | 'events' | 'vendors';

// Define submodules within each module
export type ExportSubmodule = 
  | 'expenses' 
  | 'income' 
  | 'taxes' 
  | 'employees' 
  | 'contractors'
  | 'event-details'
  | 'vendor-invoices';

// Options for export operation
export interface ExportOptions {
  format: 'excel' | 'pdf';
  module?: ExportModule;
  submodule?: ExportSubmodule;
  eventId?: string;
  eventName?: string;
  fileName?: string;
  includeHeaders?: boolean;
  includeDeleted?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
}

/**
 * Export data to Excel or PDF format
 * @param data The data to export
 * @param options Export configuration options
 */
export const exportData = (data: any[], options: ExportOptions) => {
  console.log(`Exporting ${data.length} items to ${options.format}`);
  
  // Filter out soft-deleted items unless explicitly requested
  const filteredData = options.includeDeleted 
    ? data 
    : data.filter(item => !('isDeleted' in item) || item.isDeleted !== true);
  
  // Generate default filename if not provided
  const fileName = options.fileName || generateFileName(options);
  
  if (options.format === 'excel') {
    exportToExcel(filteredData, fileName, options);
  } else if (options.format === 'pdf') {
    exportToPdf(filteredData, fileName, options);
  }
};

// Helper to generate default filename based on export options
const generateFileName = (options: ExportOptions): string => {
  const module = options.module || 'data';
  const submodule = options.submodule ? `-${options.submodule}` : '';
  const date = new Date().toISOString().split('T')[0];
  const eventSegment = options.eventName ? `-${options.eventName.toLowerCase().replace(/\s+/g, '-')}` : '';
  
  return `${module}${submodule}${eventSegment}-${date}.${options.format === 'excel' ? 'xlsx' : 'pdf'}`;
};

// Mock function to simulate Excel export
const exportToExcel = (data: any[], fileName: string, options: ExportOptions) => {
  console.log(`Exporting ${data.length} rows to Excel file: ${fileName}`);
  console.log('Export options:', options);
  
  // In a real implementation, this would use a library like xlsx or exceljs
  // Mock the browser download
  downloadMockFile(data, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

// Mock function to simulate PDF export
const exportToPdf = (data: any[], fileName: string, options: ExportOptions) => {
  console.log(`Exporting ${data.length} rows to PDF file: ${fileName}`);
  console.log('Export options:', options);
  
  // In a real implementation, this would use a library like jspdf or pdfmake
  // Mock the browser download
  downloadMockFile(data, fileName, 'application/pdf');
};

// Mock file download using Blob
const downloadMockFile = (data: any, fileName: string, mimeType: string) => {
  // Convert to JSON string
  const jsonString = JSON.stringify(data, null, 2);
  
  // Create a blob
  const blob = new Blob([jsonString], { type: mimeType });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
