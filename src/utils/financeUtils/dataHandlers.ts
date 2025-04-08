
/**
 * Utility functions for data handling in finance module
 */

import { BaseEntity } from "@/types/entities";

/**
 * Downloads data as a JSON file
 * @param data Data to download
 * @param filename Filename for the downloaded file
 * @param includeDeleted Whether to include soft-deleted items (defaults to false)
 */
export const downloadData = (data: any, filename: string, includeDeleted = false) => {
  // Filter out soft-deleted items if requested
  let processedData = data;
  
  if (!includeDeleted && Array.isArray(data)) {
    processedData = data.filter(item => {
      // Check if the item has isDeleted property and it's not true
      return !('isDeleted' in item) || item.isDeleted !== true;
    });
  }
  
  // Convert to JSON
  const jsonString = JSON.stringify(processedData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Filters a data array to exclude soft-deleted items
 * @param data Array of items to filter
 * @returns Filtered array without soft-deleted items
 */
export const filterActiveItems = <T extends BaseEntity>(data: T[]): T[] => {
  return data.filter(item => !item.isDeleted);
};

/**
 * Marks an item as deleted (soft delete)
 * @param data Array of items
 * @param id ID of the item to delete
 * @returns New array with the specified item marked as deleted
 */
export const softDeleteItem = <T extends BaseEntity>(data: T[], id: string | number): T[] => {
  return data.map(item => 
    item.id === id 
      ? { ...item, isDeleted: true, updatedAt: new Date().toISOString() } 
      : item
  );
};

/**
 * Permanently removes an item from an array
 * @param data Array of items
 * @param id ID of the item to remove
 * @returns New array without the specified item
 */
export const hardDeleteItem = <T extends BaseEntity>(data: T[], id: string | number): T[] => {
  return data.filter(item => item.id !== id);
};

/**
 * Restores a soft-deleted item
 * @param data Array of items
 * @param id ID of the item to restore
 * @returns New array with the specified item restored
 */
export const restoreItem = <T extends BaseEntity>(data: T[], id: string | number): T[] => {
  return data.map(item => 
    item.id === id 
      ? { ...item, isDeleted: false, updatedAt: new Date().toISOString() } 
      : item
  );
};
