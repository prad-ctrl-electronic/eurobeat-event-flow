
import { EntityType } from "@/types/entities";

/**
 * Registry of data dependencies for synchronization
 * Key: The entity type that was modified
 * Value: Array of functions to call to sync dependent entities
 */
const syncRegistry: Record<EntityType, Array<() => void>> = {
  event: [],
  expense: [],
  vendor: [],
  staffMember: [],
  costItem: [],
  revenueItem: []
};

/**
 * Register a callback function to be called when a specific entity type is modified
 * @param entityType The entity type to monitor for changes
 * @param callback Function to call when that entity type changes
 * @returns Unregister function to remove this callback
 */
export function registerSync(entityType: EntityType, callback: () => void): () => void {
  syncRegistry[entityType].push(callback);
  
  // Return a function to unregister this callback
  return () => {
    const index = syncRegistry[entityType].indexOf(callback);
    if (index !== -1) {
      syncRegistry[entityType].splice(index, 1);
    }
  };
}

/**
 * Trigger all registered callbacks for a specific entity type
 * @param entityType The entity type that was modified
 */
export function triggerSync(entityType: EntityType): void {
  console.log(`Triggering sync for ${entityType}`);
  syncRegistry[entityType].forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error(`Error in sync callback for ${entityType}:`, error);
    }
  });
}

/**
 * Generate a mapping of entity dependencies
 * Used to determine which entities need to be synced when another entity changes
 */
export const entityDependencies: Record<EntityType, EntityType[]> = {
  event: ['expense', 'costItem', 'revenueItem', 'staffMember'],
  expense: ['event', 'vendor'],
  vendor: ['expense'],
  staffMember: ['event'],
  costItem: ['event'],
  revenueItem: ['event']
};

/**
 * Propagate changes to dependent entities
 * @param entityType The entity type that was modified
 */
export function propagateSync(entityType: EntityType): void {
  // First sync the entity itself
  triggerSync(entityType);
  
  // Then sync all dependent entities
  const dependents = entityDependencies[entityType] || [];
  dependents.forEach(dependent => {
    triggerSync(dependent);
  });
}

/**
 * Extended propagation with operation type and affected entity ID
 * For more granular sync operations
 * @param entityType The type of entity that was modified
 * @param operation The operation performed (add, update, delete, restore)
 * @param entityId Optional ID of the specific entity affected
 */
export function propagateSyncWithOperation(
  entityType: EntityType, 
  operation: 'add' | 'update' | 'delete' | 'restore',
  entityId?: string | number
): void {
  console.log(`Propagating ${operation} for ${entityType}${entityId ? ` (ID: ${entityId})` : ''}`);
  
  // First sync the entity itself
  triggerSync(entityType);
  
  // Then sync all dependent entities
  const dependents = entityDependencies[entityType] || [];
  dependents.forEach(dependent => {
    triggerSync(dependent);
  });
  
  // Special case handling for specific operations
  if (operation === 'delete') {
    // When deleting, we need to ensure all financial calculations are updated
    if (entityType === 'expense' || entityType === 'revenueItem' || entityType === 'costItem') {
      // These all affect financial calculations
      triggerSync('event'); // Update event financials
    }
  }
}
