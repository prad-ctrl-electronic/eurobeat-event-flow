
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceHeader from "@/components/finance/FinanceHeader";

const Finance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  const handleShowAddExpense = () => {
    if (activeTab === "expenses") {
      // Logic to show add expense form within expenses tab
      return;
    }
    
    // If not on expenses tab, switch to it
    setActiveTab("expenses");
  };

  const handleShowTaxCalculator = () => {
    setActiveTab("taxes");
    // Wait for the tab to activate, then switch to the calculator sub-tab
    setTimeout(() => {
      const calculatorTab = document.querySelector('[value="calculator"]') as HTMLElement;
      if (calculatorTab) {
        calculatorTab.click();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AppHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="container mx-auto py-6 px-4">
          <FinanceHeader 
            onAddExpense={handleShowAddExpense} 
            onShowTaxCalculator={handleShowTaxCalculator}
          />
          
          <FinanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </main>
      </div>
    </div>
  );
};

export default Finance;
