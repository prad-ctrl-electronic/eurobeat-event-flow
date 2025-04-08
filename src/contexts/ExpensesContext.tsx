
import React, { ReactNode, useEffect } from 'react';
import { Expense } from '@/types/entities';
import { createEntityContext, useCoreEntity } from './EntityContext';

// Create specific context for Expenses
const { EntityProvider, useEntity, EntityContext } = createEntityContext<Expense>();

// Initial expenses data for the provider
const initialExpenses: Expense[] = [
  {
    id: 1,
    date: "2025-04-01",
    vendor: "Sound Equipment Rental",
    description: "PA System for Techno Fusion Festival",
    category: "Equipment",
    amount: 2500,
    status: "paid",
    paymentMethod: "bank transfer",
    event: "Techno Fusion Festival"
  },
  {
    id: 2,
    date: "2025-04-05",
    vendor: "Security Services Ltd",
    description: "Security staff for Bass Nation",
    category: "Security",
    amount: 1800,
    status: "pending",
    paymentMethod: "bank transfer",
    event: "Bass Nation"
  },
  {
    id: 3,
    date: "2025-04-10",
    vendor: "Event Catering Co",
    description: "Artist catering for Electronica Showcase",
    category: "Catering",
    amount: 950,
    status: "paid",
    paymentMethod: "credit card",
    event: "Electronica Showcase"
  }
];

// Enhanced provider that connects to the core entity context
export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { syncEntities } = useCoreEntity();
  
  return (
    <EntityProvider initialEntities={initialExpenses}>
      <ExpensesSyncHandler>
        {children}
      </ExpensesSyncHandler>
    </EntityProvider>
  );
};

// Component to handle syncing expenses with other entities
const ExpensesSyncHandler: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, dispatch } = useEntity();
  const { syncEntities } = useCoreEntity();
  
  // Listen for changes in the expenses and trigger syncs
  useEffect(() => {
    console.log('Expenses state changed, would sync with backend and related entities');
  }, [state.entities]);
  
  // Intercept dispatches to trigger syncs
  const originalDispatch = dispatch;
  const syncingDispatch: typeof dispatch = (action) => {
    // First perform the original dispatch
    originalDispatch(action);
    
    // Then trigger syncs based on the action
    switch (action.type) {
      case 'ADD':
        syncEntities('expense', 'add');
        break;
      case 'UPDATE':
        syncEntities('expense', 'update', action.id);
        break;
      case 'DELETE':
      case 'SOFT_DELETE':
        syncEntities('expense', 'delete', action.id);
        break;
      case 'RESTORE':
        syncEntities('expense', 'restore', action.id);
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
export const useExpenses = useEntity;

// Additional expense-specific operations can be added here
export const useExpenseOperations = () => {
  const { getEntities, addEntity, updateEntity, deleteEntity, restoreEntity } = useExpenses();
  
  // Get active expenses (not deleted)
  const getActiveExpenses = () => getEntities(false);
  
  // Get all expenses including deleted ones
  const getAllExpenses = () => getEntities(true);
  
  // Add a new expense
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    return addEntity(expense);
  };
  
  // Update an expense
  const updateExpense = (id: string | number, updates: Partial<Expense>) => {
    updateEntity(id, updates);
  };
  
  // Delete an expense (soft delete by default)
  const deleteExpense = (id: string | number, hardDelete = false) => {
    deleteEntity(id, hardDelete);
  };
  
  // Restore a soft-deleted expense
  const restoreExpense = (id: string | number) => {
    restoreEntity(id);
  };
  
  return {
    getActiveExpenses,
    getAllExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    restoreExpense
  };
};
