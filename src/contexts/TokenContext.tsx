
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TokenPosition, StaffToken, TokenStats, HourlyTokenSale } from "@/types/token";

interface TokenContextType {
  positions: TokenPosition[];
  staffTokens: StaffToken[];
  tokenStats: TokenStats;
  hourlySales: HourlyTokenSale[];
  isLoading: boolean;
}

const defaultTokenStats: TokenStats = {
  totalTokensSold: 15000,
  totalTokensCollected: 14000,
  difference: 1000,
  differencePercentage: 6.67,
  foodTruckTokens: 1000,
  barTokens: 13000,
  cloakroomTokens: 2000,
};

const initialState: TokenContextType = {
  positions: [],
  staffTokens: [],
  tokenStats: defaultTokenStats,
  hourlySales: [],
  isLoading: true
};

const TokenContext = createContext<TokenContextType>(initialState);

export const useTokens = () => useContext(TokenContext);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TokenContextType>(initialState);

  useEffect(() => {
    // Simulate loading token data
    const loadData = async () => {
      try {
        // In a real app, these would be API calls
        // Mocked data from CSV files
        const positionData: TokenPosition[] = [
          { position: 1, transactions: 456, tokensSold: 1422, cardPayments: 14220, expectedRevenue: 14230, difference: 10 },
          { position: 2, transactions: 343, tokensSold: 1223, cardPayments: 12230, expectedRevenue: 12240, difference: 10 },
          { position: 3, transactions: 232, tokensSold: 1256, cardPayments: 12560, expectedRevenue: 12570, difference: 10 },
          { position: 4, transactions: 332, tokensSold: 2334, cardPayments: 23340, expectedRevenue: 23350, difference: 10 },
          { position: 5, transactions: 766, tokensSold: 5595, cardPayments: 55950, expectedRevenue: 55960, difference: 10 },
          { position: 6, transactions: 883, tokensSold: 5467, cardPayments: 54670, expectedRevenue: 54680, difference: 10 },
          { position: 7, transactions: 227, tokensSold: 1123, cardPayments: 11230, expectedRevenue: 11240, difference: 10 },
          { position: 8, transactions: 892, tokensSold: 2323, cardPayments: 23230, expectedRevenue: 23240, difference: 10 },
          { position: 9, transactions: 219, tokensSold: 4545, cardPayments: 45450, expectedRevenue: 45460, difference: 10 },
          { position: 10, transactions: 256, tokensSold: 2355, cardPayments: 23550, expectedRevenue: 23560, difference: 10 },
        ];

        const staffTokenData: StaffToken[] = [
          { id: 1, name: "Stas", tokenType: "Food", tokensIssued: 15, comments: "Tokens zone" },
          { id: 2, name: "Alex", tokenType: "Common", tokensIssued: 5, comments: "Artists" },
        ];

        const hourlySalesData: HourlyTokenSale[] = [
          { hour: "22:00 - 23:00", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "23:00 - 00:00", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "00:00 - 01:00", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "01:00 - 02:00", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "02:00 - 03:00", salesPerHour: 200, tokensPerHour: 2000, averageTokensPerClient: 6 },
          { hour: "03:00 - 04:00", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 5 },
          { hour: "04:00 - 05:00", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 6 },
          { hour: "05:00 - 06:00", salesPerHour: 200, tokensPerHour: 2000, averageTokensPerClient: 8 },
          { hour: "06:00 - 07:00", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 4 },
          { hour: "07:00 - 08:00", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 2 },
          { hour: "08:00 - 09:00", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 10 },
        ];

        setState({
          positions: positionData,
          staffTokens: staffTokenData,
          tokenStats: defaultTokenStats,
          hourlySales: hourlySalesData,
          isLoading: false
        });
      } catch (error) {
        console.error("Error loading token data:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);

  return (
    <TokenContext.Provider value={state}>
      {children}
    </TokenContext.Provider>
  );
};
