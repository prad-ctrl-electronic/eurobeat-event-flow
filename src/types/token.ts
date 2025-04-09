
export interface TokenPosition {
  position: number;
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
}

export interface TokenStats {
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
}
