
export interface TokenPosition {
  position: number;
  eventId: string;
  transactions: number;
  tokensSold: number;
  cardPayments: number;
  expectedRevenue: number;
  difference: number;
}

export interface StaffToken {
  id: number;
  name: string;
  tokenType: string;
  tokensIssued: number;
  comments: string;
  eventId: string;
}

export interface TokenStats {
  eventId: string;
  totalTokensSold: number;
  totalTokensCollected: number;
  difference: number;
  differencePercentage: number;
  foodTruckTokens: number;
  barTokens: number;
  cloakroomTokens: number;
}

export interface HourlyTokenSale {
  hour: string;
  salesPerHour: number;
  tokensPerHour: number;
  averageTokensPerClient: number;
  eventId: string;
}

export interface TokenImport {
  position: number;
  transactions: number;
  tokensSold: number;
  cardPayments: number;
  expectedRevenue: number;
  difference?: number; // Optional as it can be calculated
  eventId: string;
}
