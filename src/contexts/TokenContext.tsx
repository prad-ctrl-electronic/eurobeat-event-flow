
import React, { createContext, useState, useContext, ReactNode } from "react";
import { TokenSalesData, StaffToken, TokenPosition } from "@/types/token";

// Sample data based on CSV files
const initialTokenSales: TokenSalesData = {
  totalSold: 15000,
  totalCollected: 14000,
  difference: 1000,
  differencePercentage: 6.67,
  expectedRevenue: 155000,
  actualRevenue: 150000,
  discrepancy: 5000,
  barTokens: 13000,
  foodTokens: 1000,
  cloakroomTokens: 2000,
  totalTransactions: 1500,
  averagePerClient: 10
};

const initialStaffTokens: StaffToken[] = [
  { id: 1, name: "Stas", tokenType: "Food", amount: 15, comments: "Tokens zone" },
  { id: 2, name: "Alex", tokenType: "Common", amount: 5, comments: "Artists" }
];

const initialPositions: TokenPosition[] = [
  {
    id: 1,
    name: "Position 1",
    transactions: 456,
    tokensSold: 1422,
    cardPayments: 14220,
    expectedRevenue: 14230,
    difference: 10
  },
  {
    id: 2,
    name: "Position 2",
    transactions: 343,
    tokensSold: 1223,
    cardPayments: 12230,
    expectedRevenue: 12240,
    difference: 10
  }
];

// Time-based sales data from CSV
const initialHourlySales = [
  { hour: "22:00 - 23:00", sales: 100, tokens: 1000, averagePerClient: 5 },
  { hour: "23:00 - 00:00", sales: 100, tokens: 1000, averagePerClient: 5 },
  { hour: "00:00 - 01:00", sales: 100, tokens: 1000, averagePerClient: 5 },
  { hour: "01:00 - 02:00", sales: 100, tokens: 1000, averagePerClient: 5 },
  { hour: "02:00 - 03:00", sales: 200, tokens: 2000, averagePerClient: 6 },
  { hour: "03:00 - 04:00", sales: 150, tokens: 1500, averagePerClient: 5 },
  { hour: "04:00 - 05:00", sales: 150, tokens: 1500, averagePerClient: 6 },
  { hour: "05:00 - 06:00", sales: 200, tokens: 2000, averagePerClient: 8 },
  { hour: "06:00 - 07:00", sales: 150, tokens: 1500, averagePerClient: 4 },
  { hour: "07:00 - 08:00", sales: 150, tokens: 1500, averagePerClient: 2 },
  { hour: "08:00 - 09:00", sales: 100, tokens: 1000, averagePerClient: 10 }
];

// Token Context type
type TokenContextType = {
  tokenSales: TokenSalesData;
  staffTokens: StaffToken[];
  positions: TokenPosition[];
  hourlySales: Array<{
    hour: string;
    sales: number;
    tokens: number;
    averagePerClient: number;
  }>;
  updateTokenSales: (data: Partial<TokenSalesData>) => void;
  addStaffToken: (token: Omit<StaffToken, 'id'>) => void;
  updateStaffToken: (id: number, data: Partial<StaffToken>) => void;
  deleteStaffToken: (id: number) => void;
  updatePosition: (id: number, data: Partial<TokenPosition>) => void;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokenSales, setTokenSales] = useState<TokenSalesData>(initialTokenSales);
  const [staffTokens, setStaffTokens] = useState<StaffToken[]>(initialStaffTokens);
  const [positions, setPositions] = useState<TokenPosition[]>(initialPositions);
  const [hourlySales, setHourlySales] = useState(initialHourlySales);

  const updateTokenSales = (data: Partial<TokenSalesData>) => {
    setTokenSales(prev => ({ ...prev, ...data }));
  };

  const addStaffToken = (token: Omit<StaffToken, 'id'>) => {
    const newId = staffTokens.length > 0 
      ? Math.max(...staffTokens.map(t => t.id)) + 1 
      : 1;
    
    setStaffTokens(prev => [...prev, { id: newId, ...token }]);
  };

  const updateStaffToken = (id: number, data: Partial<StaffToken>) => {
    setStaffTokens(prev => 
      prev.map(token => token.id === id ? { ...token, ...data } : token)
    );
  };

  const deleteStaffToken = (id: number) => {
    setStaffTokens(prev => prev.filter(token => token.id !== id));
  };

  const updatePosition = (id: number, data: Partial<TokenPosition>) => {
    setPositions(prev => 
      prev.map(position => position.id === id ? { ...position, ...data } : position)
    );
  };

  return (
    <TokenContext.Provider
      value={{
        tokenSales,
        staffTokens,
        positions,
        hourlySales,
        updateTokenSales,
        addStaffToken,
        updateStaffToken,
        deleteStaffToken,
        updatePosition
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
};
