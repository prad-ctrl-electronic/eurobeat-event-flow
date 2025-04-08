
import React, { ReactNode, useEffect } from 'react';
import { StaffMember } from '@/types/entities';
import { createEntityContext, useCoreEntity } from './EntityContext';

// Create specific context for StaffMembers
const { EntityProvider, useEntity, EntityContext } = createEntityContext<StaffMember>();

// Initial staffMembers data for the provider will be empty
// We'll load data from staffingData in the provider
const initialStaffMembers: StaffMember[] = [];

// Enhanced provider that connects to the core entity context
export const StaffMembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { syncEntities } = useCoreEntity();
  
  return (
    <EntityProvider initialEntities={initialStaffMembers}>
      <StaffMembersSyncHandler>
        {children}
      </StaffMembersSyncHandler>
    </EntityProvider>
  );
};

// Component to handle syncing staff members with other entities
const StaffMembersSyncHandler: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, dispatch } = useEntity();
  const { syncEntities } = useCoreEntity();
  
  // Listen for changes in the staff members and trigger syncs
  useEffect(() => {
    console.log('StaffMembers state changed, would sync with backend and related entities');
  }, [state.entities]);
  
  // Intercept dispatches to trigger syncs
  const originalDispatch = dispatch;
  const syncingDispatch: typeof dispatch = (action) => {
    // First perform the original dispatch
    originalDispatch(action);
    
    // Then trigger syncs based on the action
    switch (action.type) {
      case 'ADD':
        syncEntities('staffMember', 'add');
        break;
      case 'UPDATE':
        syncEntities('staffMember', 'update', action.id);
        break;
      case 'DELETE':
      case 'SOFT_DELETE':
        syncEntities('staffMember', 'delete', action.id);
        break;
      case 'RESTORE':
        syncEntities('staffMember', 'restore', action.id);
        break;
    }
  };
  
  return (
    <EntityContext.Provider 
      value={{
        ...useEntity(),
        dispatch: syncingDispatch
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

// Export the hook for consuming components
export const useStaffMembers = useEntity;

// Additional staff-specific operations can be added here
export const useStaffMemberOperations = () => {
  const { getEntities, addEntity, updateEntity, deleteEntity, restoreEntity } = useStaffMembers();
  
  // Get active staff members (not deleted)
  const getActiveStaffMembers = () => getEntities(false);
  
  // Get all staff members including deleted ones
  const getAllStaffMembers = () => getEntities(true);
  
  // Add a new staff member
  const addStaffMember = (staffMember: Omit<StaffMember, 'id'>) => {
    return addEntity(staffMember);
  };
  
  // Update a staff member
  const updateStaffMember = (id: string | number, updates: Partial<StaffMember>) => {
    updateEntity(id, updates);
  };
  
  // Delete a staff member (soft delete by default)
  const deleteStaffMember = (id: string | number, hardDelete = false) => {
    deleteEntity(id, hardDelete);
  };
  
  // Restore a soft-deleted staff member
  const restoreStaffMember = (id: string | number) => {
    restoreEntity(id);
  };
  
  // Generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };
  
  return {
    getActiveStaffMembers,
    getAllStaffMembers,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    restoreStaffMember,
    getInitials
  };
};
