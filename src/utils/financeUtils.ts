
import { calculateDCF, calculateCCA, calculateAssetBased, calculateDDM } from './valuationUtils';

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

// Polish Tax Constants and Calculation Functions
export const calculatePolishTax = {
  // Calculate PIT based on contract type, salary and other factors
  calculatePIT: (grossSalary: number, contractType: string, taxScale: string = 'progressive') => {
    // Default values
    let taxRate = 0.12; // Standard 12% rate
    let taxFreeAmount = 30000 / 12; // Monthly tax-free amount (30,000 PLN annually)
    
    switch (contractType) {
      case 'B2B':
        if (taxScale === 'flat') {
          taxRate = 0.19; // Flat tax 19%
          taxFreeAmount = 0;
        } else if (taxScale === 'ryczalt') {
          taxRate = 0.15; // Simplified tax rate (estimate, actually depends on industry)
          taxFreeAmount = 0;
        }
        break;
        
      case 'UoD':
        // Civil contracts use standard rate but may have different deductions
        taxFreeAmount = taxFreeAmount / 2; // Simplified estimation
        break;
      
      case 'UoP':
        // Standard progressive scale for employment contracts
        if (grossSalary * 12 > 120000) {
          // Higher tax bracket applies to the portion above 120,000 PLN
          const lowerBracketIncome = 120000 / 12;
          const higherBracketIncome = grossSalary - lowerBracketIncome;
          
          const lowerBracketTax = (lowerBracketIncome - taxFreeAmount) * 0.12;
          const higherBracketTax = higherBracketIncome * 0.32;
          
          return Math.max(0, lowerBracketTax + higherBracketTax);
        }
        break;
    }
    
    return Math.max(0, (grossSalary - taxFreeAmount) * taxRate);
  },
  
  // Calculate ZUS contributions based on contract type and salary
  calculateZUS: (grossSalary: number, contractType: string, zusPreference: string = 'full') => {
    // Employer contributions
    let employerContributions = 0;
    // Employee contributions
    let employeeContributions = 0;
    // Health insurance
    let healthInsurance = 0;
    
    switch (contractType) {
      case 'UoP': // Employment contract
        // Employer contributions (approximate rates)
        employerContributions = grossSalary * 0.2048; // ~20.48% of gross salary
        
        // Employee contributions
        employeeContributions = grossSalary * 0.1381; // ~13.81% of gross salary
        
        // Health insurance (calculated after employee social security deduction)
        healthInsurance = (grossSalary - employeeContributions) * 0.09;
        break;
      
      case 'UoD': // Civil contract
        // Typically only health insurance and limited social security
        employeeContributions = grossSalary * 0.0245; // Sickness insurance only
        healthInsurance = (grossSalary - employeeContributions) * 0.09;
        break;
      
      case 'B2B': // Business-to-business
        // For B2B, the person pays their own ZUS
        switch (zusPreference) {
          case 'preferential':
            // Preferential rate for first 24 months
            employeeContributions = 380.25; // Fixed amount in 2023
            break;
          case 'minimal':
            // Minimal contributions
            employeeContributions = 1200; // Approximate minimal ZUS
            break;
          case 'full':
          default:
            // Full standard contributions
            employeeContributions = 1600; // Approximate full ZUS contribution
            break;
        }
        // Health insurance is separately calculated for B2B
        healthInsurance = 381.81; // Standard health contribution in 2023
        break;
    }
    
    return {
      employerContributions,
      employeeContributions,
      healthInsurance,
      total: employerContributions + employeeContributions + healthInsurance
    };
  },
  
  // Calculate CIT (Corporate Income Tax)
  calculateCIT: (revenue: number, costs: number, isSmallTaxpayer: boolean = true) => {
    const profit = Math.max(0, revenue - costs);
    const citRate = isSmallTaxpayer ? 0.09 : 0.19; // 9% for small taxpayers, 19% standard
    
    return profit * citRate;
  },
  
  // Calculate VAT
  calculateVAT: (netAmount: number, vatRate: number) => {
    return netAmount * (vatRate / 100);
  },
  
  // Calculate total employer cost
  calculateEmployerCost: (grossSalary: number, contractType: string) => {
    if (contractType === 'UoP') {
      const zusEmployer = grossSalary * 0.2048; // Approximate employer ZUS costs
      return grossSalary + zusEmployer;
    }
    
    // For other contract types, employer cost is typically the gross amount
    return grossSalary;
  },
  
  // Calculate net salary
  calculateNetSalary: (grossSalary: number, contractType: string, taxScale: string = 'progressive', zusPreference: string = 'full') => {
    if (contractType === 'B2B') {
      // For B2B, rough estimation as they pay their own taxes
      const zus = calculatePolishTax.calculateZUS(grossSalary, 'B2B', zusPreference);
      const pitBase = grossSalary - zus.employeeContributions;
      const pit = calculatePolishTax.calculatePIT(pitBase, 'B2B', taxScale);
      
      return grossSalary - zus.employeeContributions - zus.healthInsurance - pit;
    } else {
      // For employment and civil contracts
      const zus = calculatePolishTax.calculateZUS(grossSalary, contractType);
      const pit = calculatePolishTax.calculatePIT(grossSalary, contractType, taxScale);
      
      return grossSalary - zus.employeeContributions - zus.healthInsurance - pit;
    }
  },
  
  // Generate tax declaration data
  generateTaxDeclaration: (type: 'PIT-11' | 'VAT-7' | 'CIT-8', data: any) => {
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[date.getMonth()];
    const currentYear = date.getFullYear();
    
    // Basic structure for tax declarations
    const declaration = {
      type,
      generatedDate: date.toISOString(),
      period: `${currentMonth} ${currentYear}`,
      data: { ...data },
      status: 'Draft'
    };
    
    return declaration;
  }
};

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

// Re-export valuation methods
export { 
  calculateDCF, 
  calculateCCA, 
  calculateAssetBased, 
  calculateDDM, 
  calculateWeightedValuation 
} from './valuationUtils';
