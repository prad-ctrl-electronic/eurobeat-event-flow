
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface RevenueItem {
  id: string;
  date: string;
  category: string;
  description: string;
  netAmount: number;
  vatPercent: number;
  grossAmount: number;
  status: string;
  notes: string;
}

export function useRevenue(initialItems: RevenueItem[] = []) {
  const [revenueItems, setRevenueItems] = useState<RevenueItem[]>(initialItems);
  const [newRevenueOpen, setNewRevenueOpen] = useState(false);
  const [editRevenueOpen, setEditRevenueOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueItem | null>(null);
  
  // Function to calculate gross amount based on net and VAT
  const calculateGrossAmount = (netAmount: number, vatPercent: number) => {
    return netAmount * (1 + vatPercent / 100);
  };
  
  // Add a new revenue item
  const addRevenueItem = (item: Omit<RevenueItem, "id" | "grossAmount">) => {
    const grossAmount = calculateGrossAmount(item.netAmount, item.vatPercent);
    
    const newItem = {
      ...item,
      id: uuidv4(),
      grossAmount
    };
    
    setRevenueItems(prev => [...prev, newItem]);
    toast.success("Revenue item added!");
  };
  
  // Update an existing revenue item
  const updateRevenueItem = (id: string, updates: Partial<Omit<RevenueItem, "id">>) => {
    setRevenueItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          // Recalculate gross amount if net or VAT changed
          let grossAmount = item.grossAmount;
          if (updates.netAmount !== undefined || updates.vatPercent !== undefined) {
            const netAmount = updates.netAmount ?? item.netAmount;
            const vatPercent = updates.vatPercent ?? item.vatPercent;
            grossAmount = calculateGrossAmount(netAmount, vatPercent);
          }
          
          return {
            ...item,
            ...updates,
            grossAmount
          };
        }
        return item;
      });
    });
    
    toast.success("Revenue item updated!");
  };
  
  // Delete a revenue item
  const deleteRevenueItem = (id: string) => {
    setRevenueItems(prev => prev.filter(item => item.id !== id));
    toast.success("Revenue item deleted!");
  };
  
  // Open the edit dialog for a revenue item
  const openEditDialog = (item: RevenueItem) => {
    setSelectedRevenue(item);
    setEditRevenueOpen(true);
  };
  
  return {
    revenueItems,
    setRevenueItems,
    newRevenueOpen,
    setNewRevenueOpen,
    editRevenueOpen,
    setEditRevenueOpen,
    selectedRevenue,
    setSelectedRevenue,
    addRevenueItem,
    updateRevenueItem,
    deleteRevenueItem,
    openEditDialog,
    calculateGrossAmount
  };
}
