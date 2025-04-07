export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-EU', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2 
  }).format(amount);
};

export const getVarianceClass = (variance: number): string => {
  return variance < 0 
    ? "text-red-500" 
    : variance > 0 
      ? "text-green-500" 
      : "text-muted-foreground";
};

export const downloadData = (data: any, filename: string) => {
  // Convert to JSON
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate default company valuation data based on financial metrics
export const generateDefaultValuationData = (
  revenueData: { actual: number }[] = [], 
  budgetData: { actual: number }[] = [],
  invoiceData: { amount: number }[] = [],
  loansData: { outstandingAmount: number, interestRate: number }[] = []
) => {
  // Calculate key financial metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.actual, 0) || 248540; // Fallback to value from FinancialOverview
  const totalExpenses = budgetData.reduce((sum, item) => sum + item.actual, 0) || 84600;
  const outstandingInvoices = invoiceData.reduce((sum, item) => sum + item.amount, 0) || 0;
  const outstandingDebt = loansData.reduce((sum, loan) => sum + loan.outstandingAmount, 0) || 0;
  
  // Calculate profit metrics
  const ebitda = totalRevenue - totalExpenses || totalRevenue * 0.248; // Fallback to 24.8% EBITDA from FinancialOverview
  const ebitdaMargin = (ebitda / totalRevenue) * 100;
  
  // Cash flow projections (simple growth model)
  const growthRate = 0.1; // 10% annual growth
  const cashFlowProjections = [
    ebitda,
    ebitda * (1 + growthRate),
    ebitda * (1 + growthRate) ** 2,
    ebitda * (1 + growthRate) ** 3,
    ebitda * (1 + growthRate) ** 4
  ];
  
  // Industry averages (default values)
  const industryPERatio = 15;
  const industryEVToEBITDA = 8;
  const industryEVToRevenue = 2;

  // Default dividend values
  const dividendPayout = ebitda * 0.3; // 30% of earnings paid as dividends
  const dividendPerShare = dividendPayout / 1000000; // Assuming 1M shares
  const dividendGrowthRate = 0.05; // 5% annual growth
  
  return {
    cash_flows: cashFlowProjections.join(','),
    discount_rate: 0.1,
    terminal_growth_rate: 0.03,
    outstanding_shares: 1000000,
    revenue: totalRevenue,
    ebitda: ebitda,
    earnings_per_share: ebitda / 1000000, // Assuming 1M shares
    industry_pe_ratio: industryPERatio,
    industry_ev_to_ebitda: industryEVToEBITDA,
    industry_ev_to_revenue: industryEVToRevenue,
    total_assets: totalRevenue * 1.5, // Simple estimate
    total_liabilities: outstandingDebt + (totalExpenses * 0.4), // Outstanding debt + estimated current liabilities
    current_dividend: dividendPerShare,
    dividend_growth_rate: dividendGrowthRate,
    required_rate: 0.1
  };
};

// Company Valuation Calculation Methods

// 1. Discounted Cash Flow (DCF) Model
export const calculateDCF = (
  cashFlows: number[],
  discountRate: number,
  terminalGrowthRate: number,
  outstandingShares: number
): { 
  enterpriseValue: number, 
  equityValue: number, 
  sharePrice: number 
} => {
  // Calculate present value of projected cash flows
  let presentValue = 0;
  cashFlows.forEach((cashFlow, index) => {
    presentValue += cashFlow / Math.pow(1 + discountRate, index + 1);
  });

  // Calculate terminal value
  const lastCashFlow = cashFlows[cashFlows.length - 1];
  const terminalValue = lastCashFlow * (1 + terminalGrowthRate) / 
                        (discountRate - terminalGrowthRate);
  
  // Discount terminal value to present
  const discountedTerminalValue = terminalValue / 
                                Math.pow(1 + discountRate, cashFlows.length);
  
  // Enterprise Value = PV of cash flows + PV of terminal value
  const enterpriseValue = presentValue + discountedTerminalValue;
  
  // Equity Value = Enterprise Value - Net Debt
  // Assuming no debt for simplicity, can be adjusted with actual net debt
  const equityValue = enterpriseValue;
  
  // Share Price = Equity Value / Outstanding Shares
  const sharePrice = equityValue / outstandingShares;
  
  return { enterpriseValue, equityValue, sharePrice };
};

// 2. Comparable Company Analysis (CCA)
export const calculateCCA = (
  revenue: number,
  ebitda: number,
  earningsPerShare: number,
  outstandingShares: number,
  industryPERatio: number,
  industryEVToEBITDA: number,
  industryEVToRevenue: number
): {
  priceBased: number,
  revenueBased: number,
  ebitdaBased: number
} => {
  // Price-to-Earnings method
  const priceBased = earningsPerShare * industryPERatio;
  
  // EV/Revenue method (need to convert to per share)
  const evBasedOnRevenue = revenue * industryEVToRevenue;
  const revenueBased = evBasedOnRevenue / outstandingShares;
  
  // EV/EBITDA method (need to convert to per share)
  const evBasedOnEBITDA = ebitda * industryEVToEBITDA;
  const ebitdaBased = evBasedOnEBITDA / outstandingShares;
  
  return { priceBased, revenueBased, ebitdaBased };
};

// 3. Asset-Based Valuation
export const calculateAssetBased = (
  totalAssets: number,
  totalLiabilities: number,
  outstandingShares: number
): {
  bookValue: number,
  sharePrice: number
} => {
  const bookValue = totalAssets - totalLiabilities;
  const sharePrice = bookValue / outstandingShares;
  
  return { bookValue, sharePrice };
};

// 4. Dividend Discount Model
export const calculateDDM = (
  currentDividend: number,
  dividendGrowthRate: number,
  requiredRate: number
): number => {
  // Gordon Growth Model (assumes constant growth rate forever)
  return currentDividend * (1 + dividendGrowthRate) / (requiredRate - dividendGrowthRate);
};

// Calculate weighted average of different methods
export const calculateWeightedValuation = (
  valuations: {method: string, value: number, weight: number}[]
): {
  weightedAverage: number,
  breakdown: {method: string, value: number, weight: number, contribution: number}[]
} => {
  let totalWeight = 0;
  let weightedSum = 0;
  const breakdown: {method: string, value: number, weight: number, contribution: number}[] = [];
  
  valuations.forEach(val => {
    totalWeight += val.weight;
    weightedSum += val.value * val.weight;
    
    breakdown.push({
      ...val,
      contribution: val.value * val.weight
    });
  });
  
  const weightedAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  return { weightedAverage, breakdown };
};
