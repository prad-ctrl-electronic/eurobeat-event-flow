
/**
 * Helper functions for company valuations
 */
import { calculateDCF, calculateCCA, calculateAssetBased, calculateDDM } from '../valuationUtils';

// Generate default valuation data based on financial information
export const generateDefaultValuationData = (
  revenueData: { actual: number }[] = [], 
  budgetData: { actual: number }[] = [],
  invoiceData: { 
    amountGross: string;
    currency: string; 
    amountPLN: string;
    [key: string]: any;
  }[] = [],
  loansData: { outstandingAmount: number, interestRate: number }[] = []
) => {
  // Calculate key financial metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.actual, 0) || 248540; // Fallback to value from FinancialOverview
  const totalExpenses = budgetData.reduce((sum, item) => sum + item.actual, 0) || 84600;
  
  // Extract invoice amounts correctly - parse the string amounts to numbers
  const outstandingInvoices = invoiceData.reduce((sum, item) => {
    // Use amountPLN for consistency in currency
    const amount = parseFloat(item.amountPLN.replace(/,/g, ""));
    return isNaN(amount) ? sum : sum + amount;
  }, 0) || 0;
  
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
