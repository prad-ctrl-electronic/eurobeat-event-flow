
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TokenPosition, StaffToken, TokenStats, HourlyTokenSale, TokenImport } from "@/types/token";
import { useEvent } from "@/contexts/EventContext";

interface TokenContextType {
  positions: TokenPosition[];
  staffTokens: StaffToken[];
  tokenStats: TokenStats;
  hourlySales: HourlyTokenSale[];
  isLoading: boolean;
  addTokenPosition: (position: TokenImport) => void;
  addMultiplePositions: (positions: TokenImport[]) => void;
}

const defaultTokenStats = (eventId: string): TokenStats => ({
  eventId,
  totalTokensSold: 15000,
  totalTokensCollected: 14000,
  difference: 1000,
  differencePercentage: 6.67,
  foodTruckTokens: 1000,
  barTokens: 13000,
  cloakroomTokens: 2000,
});

const TokenContext = createContext<TokenContextType | null>(null);

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
};

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const { selectedEventId } = useEvent();
  const [allPositions, setAllPositions] = useState<TokenPosition[]>([]);
  const [allStaffTokens, setAllStaffTokens] = useState<StaffToken[]>([]);
  const [allTokenStats, setAllTokenStats] = useState<TokenStats[]>([]);
  const [allHourlySales, setAllHourlySales] = useState<HourlyTokenSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter data based on selected event
  const positions = allPositions.filter(pos => 
    selectedEventId === "all" || pos.eventId === selectedEventId
  );
  
  const staffTokens = allStaffTokens.filter(token => 
    selectedEventId === "all" || token.eventId === selectedEventId
  );
  
  const tokenStats = allTokenStats.find(stat => stat.eventId === selectedEventId) || 
    defaultTokenStats(selectedEventId);
  
  const hourlySales = allHourlySales.filter(sale => 
    selectedEventId === "all" || sale.eventId === selectedEventId
  );

  // Add new position data
  const addTokenPosition = (position: TokenImport) => {
    const newPosition: TokenPosition = {
      ...position,
      difference: position.difference || (position.expectedRevenue - position.cardPayments)
    };
    
    setAllPositions(prev => [...prev, newPosition]);
    
    // Update token stats for the event
    updateTokenStatsForEvent(position.eventId);
  };

  // Add multiple positions at once (for CSV import)
  const addMultiplePositions = (positions: TokenImport[]) => {
    const newPositions: TokenPosition[] = positions.map(pos => ({
      ...pos,
      difference: pos.difference || (pos.expectedRevenue - pos.cardPayments)
    }));
    
    setAllPositions(prev => [...prev, ...newPositions]);
    
    // Get unique event IDs from the new positions
    const eventIds = [...new Set(positions.map(pos => pos.eventId))];
    
    // Update token stats for each affected event
    eventIds.forEach(eventId => updateTokenStatsForEvent(eventId));
  };

  // Update token stats for a specific event based on positions
  const updateTokenStatsForEvent = (eventId: string) => {
    const eventPositions = allPositions.filter(pos => pos.eventId === eventId);
    
    if (eventPositions.length === 0) return;
    
    // Calculate totals
    const totalTokensSold = eventPositions.reduce((sum, pos) => sum + pos.tokensSold, 0);
    const totalCardPayments = eventPositions.reduce((sum, pos) => sum + pos.cardPayments, 0);
    
    // Estimate collected tokens (in a real app, this would come from actual data)
    const totalTokensCollected = Math.round(totalTokensSold * 0.93); // 93% collection rate for example
    const difference = totalTokensSold - totalTokensCollected;
    const differencePercentage = totalTokensSold > 0 
      ? ((difference / totalTokensSold) * 100)
      : 0;
    
    // Mock distribution (in a real app, this would be actual data)
    const foodTruckTokens = Math.round(totalTokensCollected * 0.07);
    const barTokens = Math.round(totalTokensCollected * 0.75);
    const cloakroomTokens = totalTokensCollected - foodTruckTokens - barTokens;
    
    const newStats: TokenStats = {
      eventId,
      totalTokensSold,
      totalTokensCollected,
      difference,
      differencePercentage: parseFloat(differencePercentage.toFixed(2)),
      foodTruckTokens,
      barTokens,
      cloakroomTokens
    };
    
    setAllTokenStats(prev => {
      const existingIndex = prev.findIndex(stat => stat.eventId === eventId);
      if (existingIndex >= 0) {
        // Replace existing stats
        const updated = [...prev];
        updated[existingIndex] = newStats;
        return updated;
      } else {
        // Add new stats
        return [...prev, newStats];
      }
    });
  };

  useEffect(() => {
    // Load initial mock data
    const loadData = async () => {
      try {
        // Initial mock data with event IDs
        const positionData: TokenPosition[] = [
          { position: 1, eventId: "tf-2025", transactions: 456, tokensSold: 1422, cardPayments: 14220, expectedRevenue: 14230, difference: 10 },
          { position: 2, eventId: "tf-2025", transactions: 343, tokensSold: 1223, cardPayments: 12230, expectedRevenue: 12240, difference: 10 },
          { position: 3, eventId: "tf-2025", transactions: 232, tokensSold: 1256, cardPayments: 12560, expectedRevenue: 12570, difference: 10 },
          { position: 4, eventId: "bn-2025", transactions: 332, tokensSold: 2334, cardPayments: 23340, expectedRevenue: 23350, difference: 10 },
          { position: 5, eventId: "bn-2025", transactions: 766, tokensSold: 5595, cardPayments: 55950, expectedRevenue: 55960, difference: 10 },
          { position: 6, eventId: "boiler-room", transactions: 883, tokensSold: 5467, cardPayments: 54670, expectedRevenue: 54680, difference: 10 },
          { position: 7, eventId: "boiler-room", transactions: 227, tokensSold: 1123, cardPayments: 11230, expectedRevenue: 11240, difference: 10 },
          { position: 8, eventId: "boiler-room", transactions: 892, tokensSold: 2323, cardPayments: 23230, expectedRevenue: 23240, difference: 10 },
          { position: 9, eventId: "es-2025", transactions: 219, tokensSold: 4545, cardPayments: 45450, expectedRevenue: 45460, difference: 10 },
          { position: 10, eventId: "es-2025", transactions: 256, tokensSold: 2355, cardPayments: 23550, expectedRevenue: 23560, difference: 10 },
        ];

        const staffTokenData: StaffToken[] = [
          { id: 1, name: "Stas", eventId: "boiler-room", tokenType: "Food", tokensIssued: 15, comments: "Tokens zone" },
          { id: 2, name: "Alex", eventId: "tf-2025", tokenType: "Common", tokensIssued: 5, comments: "Artists" },
        ];

        const hourlySalesData: HourlyTokenSale[] = [
          { hour: "22:00 - 23:00", eventId: "boiler-room", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "23:00 - 00:00", eventId: "boiler-room", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "00:00 - 01:00", eventId: "boiler-room", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "01:00 - 02:00", eventId: "boiler-room", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 5 },
          { hour: "02:00 - 03:00", eventId: "tf-2025", salesPerHour: 200, tokensPerHour: 2000, averageTokensPerClient: 6 },
          { hour: "03:00 - 04:00", eventId: "tf-2025", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 5 },
          { hour: "04:00 - 05:00", eventId: "tf-2025", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 6 },
          { hour: "05:00 - 06:00", eventId: "bn-2025", salesPerHour: 200, tokensPerHour: 2000, averageTokensPerClient: 8 },
          { hour: "06:00 - 07:00", eventId: "bn-2025", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 4 },
          { hour: "07:00 - 08:00", eventId: "es-2025", salesPerHour: 150, tokensPerHour: 1500, averageTokensPerClient: 2 },
          { hour: "08:00 - 09:00", eventId: "es-2025", salesPerHour: 100, tokensPerHour: 1000, averageTokensPerClient: 10 },
        ];

        // Generate event-specific stats
        const eventIds = ["tf-2025", "bn-2025", "boiler-room", "es-2025"];
        const tokenStatsData: TokenStats[] = eventIds.map(eventId => {
          const eventPositions = positionData.filter(pos => pos.eventId === eventId);
          const totalTokensSold = eventPositions.reduce((sum, pos) => sum + pos.tokensSold, 0);
          const totalTokensCollected = Math.round(totalTokensSold * 0.93);
          const difference = totalTokensSold - totalTokensCollected;
          const differencePercentage = ((difference / totalTokensSold) * 100).toFixed(2);
          
          return {
            eventId,
            totalTokensSold,
            totalTokensCollected,
            difference,
            differencePercentage: parseFloat(differencePercentage),
            foodTruckTokens: Math.round(totalTokensCollected * 0.07),
            barTokens: Math.round(totalTokensCollected * 0.75),
            cloakroomTokens: Math.round(totalTokensCollected * 0.18),
          };
        });

        setAllPositions(positionData);
        setAllStaffTokens(staffTokenData);
        setAllTokenStats(tokenStatsData);
        setAllHourlySales(hourlySalesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading token data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <TokenContext.Provider 
      value={{
        positions,
        staffTokens,
        tokenStats,
        hourlySales,
        isLoading,
        addTokenPosition,
        addMultiplePositions
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
