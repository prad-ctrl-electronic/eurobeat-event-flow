
export interface TokenSalesData {
  totalSold: number;
  totalCollected: number;
  difference: number;
  differencePercentage: number;
  expectedRevenue: number;
  actualRevenue: number;
  discrepancy: number;
  barTokens: number;
  foodTokens: number;
  cloakroomTokens?: number;
  totalTransactions: number;
  averagePerClient: number;
}

export interface StaffToken {
  id: number;
  name: string;
  tokenType: string;
  amount: number;
  comments?: string;
}

export interface TokenPosition {
  id: number;
  name: string;
  transactions: number;
  tokensSold: number;
  cardPayments: number;
  expectedRevenue: number;
  difference: number;
}

export interface TokenInventory {
  startingTokens: number;
  openBoxes: number;
  remainingTokens: number;
  boxNumbers: string;
}

export interface TokenSalesByHour {
  hour: string;
  sales: number;
  tokens: number;
  averagePerClient: number;
}
