
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BaseEntity, EntityAction, Notification } from '@/types/entities';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

// Generic entity management context and helpers
type EntityState<T extends BaseEntity> = {
  entities: T[];
  loading: boolean;
  error: string | null;
};

// Generic entity reducer function
function entityReducer<T extends BaseEntity>(
  state: EntityState<T>, 
  action: EntityAction<T>
): EntityState<T> {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        entities: [...state.entities, action.payload],
      };
    case 'UPDATE':
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.id ? { ...entity, ...action.payload } : entity
        ),
      };
    case 'DELETE':
      return {
        ...state,
        entities: state.entities.filter((entity) => entity.id !== action.id),
      };
    case 'SOFT_DELETE':
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.id ? { ...entity, isDeleted: true } : entity
        ),
      };
    case 'RESTORE':
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.id ? { ...entity, isDeleted: false } : entity
        ),
      };
    case 'SET':
      return {
        ...state,
        entities: action.payload,
      };
    default:
      return state;
  }
}

// Core entity context interface
export interface EntityContextValue {
  // Notification system
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type'], duration?: number) => void;
  removeNotification: (id: string) => void;
  
  // Global sync helper
  syncEntities: (entityType: string, action: string, entityId?: string | number) => void;
}

// Helper function to create entity contexts
export function createEntityContext<T extends BaseEntity>() {
  // Create the specific entity context
  const EntityContext = createContext<{
    state: EntityState<T>;
    dispatch: React.Dispatch<EntityAction<T>>;
    getEntities: (includeDeleted?: boolean) => T[];
    addEntity: (entity: Omit<T, 'id'>) => void;
    updateEntity: (id: string | number, updates: Partial<T>) => void;
    deleteEntity: (id: string | number, hardDelete?: boolean) => void;
    restoreEntity: (id: string | number) => void;
  } | null>(null);

  // Create provider component
  const EntityProvider = ({ children, initialEntities = [] }: { 
    children: ReactNode;
    initialEntities?: T[];
  }) => {
    const [state, dispatch] = useReducer(entityReducer<T>, {
      entities: initialEntities,
      loading: false,
      error: null,
    });

    // Helper functions
    const getEntities = (includeDeleted = false) => {
      return includeDeleted 
        ? state.entities 
        : state.entities.filter(entity => !entity.isDeleted);
    };

    const addEntity = (entity: Omit<T, 'id'>) => {
      const newId = typeof initialEntities[0]?.id === 'number' 
        ? Math.max(0, ...state.entities.map(e => Number(e.id))) + 1 
        : uuidv4();
        
      const newEntity = {
        ...entity,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as T;
      
      dispatch({ type: 'ADD', payload: newEntity });
      
      // Show toast notification
      toast.success(`New entity added successfully`);
      
      return newId;
    };

    const updateEntity = (id: string | number, updates: Partial<T>) => {
      dispatch({ 
        type: 'UPDATE', 
        id, 
        payload: { 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } 
      });
      
      // Show toast notification
      toast.success(`Entity updated successfully`);
    };

    const deleteEntity = (id: string | number, hardDelete = false) => {
      if (hardDelete) {
        dispatch({ type: 'DELETE', id });
      } else {
        dispatch({ type: 'SOFT_DELETE', id });
      }
      
      // Show toast notification
      toast.success(`Entity ${hardDelete ? 'permanently' : ''} deleted successfully`);
    };

    const restoreEntity = (id: string | number) => {
      dispatch({ type: 'RESTORE', id });
      
      // Show toast notification
      toast.success(`Entity restored successfully`);
    };

    return (
      <EntityContext.Provider
        value={{
          state,
          dispatch,
          getEntities,
          addEntity,
          updateEntity,
          deleteEntity,
          restoreEntity,
        }}
      >
        {children}
      </EntityContext.Provider>
    );
  };

  // Create hook for using this context
  const useEntity = () => {
    const context = useContext(EntityContext);
    if (!context) {
      throw new Error('useEntity must be used within its EntityProvider');
    }
    return context;
  };

  return { EntityProvider, useEntity, EntityContext };
}

// Core notification context
const NotificationContext = createContext<{
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type'], duration?: number) => void;
  removeNotification: (id: string) => void;
} | null>(null);

// Core entity context for global operations
const CoreEntityContext = createContext<EntityContextValue | null>(null);

// Entity sync mappings - what needs to update when an entity changes
const entitySyncMap: Record<string, string[]> = {
  'event': ['expense', 'costItem', 'revenueItem', 'staffAssignment'],
  'expense': ['event', 'vendor'],
  'vendor': ['expense'],
  'staffMember': ['staffAssignment', 'event'],
  'costItem': ['event'],
  'revenueItem': ['event'],
};

// Provider component for core entity context
export const CoreEntityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Notification state
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (
    message: string, 
    type: Notification['type'] = 'info', 
    duration = 5000
  ) => {
    const newNotification = {
      id: uuidv4(),
      message,
      type,
      duration,
      timestamp: Date.now(),
    };
    
    setNotifications((prev) => [...prev, newNotification]);
    
    // Auto-remove after duration
    if (duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Function to sync entities when changes occur
  const syncEntities = (entityType: string, action: string, entityId?: string | number) => {
    // Get related entity types that need to be refreshed
    const relatedEntities = entitySyncMap[entityType] || [];
    
    console.log(`Syncing ${action} for ${entityType} (ID: ${entityId}) with: ${relatedEntities.join(', ')}`);
    
    // Trigger refresh for each related entity type
    // In a real implementation, this would dispatch actions to refresh data
    // This is a placeholder for the actual implementation
  };

  // Combine all context values
  const contextValue: EntityContextValue = {
    notifications,
    addNotification,
    removeNotification,
    syncEntities,
  };

  return (
    <CoreEntityContext.Provider value={contextValue}>
      <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
        {children}
      </NotificationContext.Provider>
    </CoreEntityContext.Provider>
  );
};

export const useCoreEntity = () => {
  const context = useContext(CoreEntityContext);
  if (!context) {
    throw new Error('useCoreEntity must be used within CoreEntityProvider');
  }
  return context;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationContext');
  }
  return context;
};
