
import { toast } from "sonner";

export interface Loan {
  id: string;
  lender: string;
  amount: number;
  currency: string;
  interestRate: number;
  startDate: string;
  endDate: string;
  repaymentSchedule: "monthly" | "quarterly" | "annually" | "custom";
  repaymentAmount?: number;
  status: "active" | "paid" | "defaulted";
  outstandingAmount: number;
  description?: string;
}

export interface InvoiceDebt {
  invoiceId: string;
  supplier: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysPastDue: number;
}

// Sample loan data
export const loansData: Loan[] = [
  {
    id: "L001",
    lender: "City Bank",
    amount: 50000,
    currency: "EUR",
    interestRate: 5.5,
    startDate: "2023-06-01",
    endDate: "2026-06-01",
    repaymentSchedule: "monthly",
    repaymentAmount: 1500,
    outstandingAmount: 32500,
    status: "active",
    description: "Equipment financing loan"
  },
  {
    id: "L002",
    lender: "Investment Group X",
    amount: 100000,
    currency: "EUR",
    interestRate: 7.25,
    startDate: "2024-01-15",
    endDate: "2029-01-15",
    repaymentSchedule: "quarterly",
    repaymentAmount: 6250,
    outstandingAmount: 93750,
    status: "active",
    description: "Expansion capital"
  },
  {
    id: "L003",
    lender: "Private Investor",
    amount: 35000,
    currency: "EUR",
    interestRate: 4.75,
    startDate: "2023-11-01",
    endDate: "2025-11-01",
    repaymentSchedule: "monthly",
    repaymentAmount: 1530,
    outstandingAmount: 24350,
    status: "active",
    description: "Working capital loan"
  }
];

// Calculate overdue invoice debts
export const calculateInvoiceDebts = (invoices: any[]): InvoiceDebt[] => {
  const today = new Date();
  
  return invoices
    .filter(invoice => 
      // Filter for unpaid invoices with due dates
      invoice.status !== "Already paid" && 
      invoice.status !== "Alredy paid" && 
      invoice.dueDate
    )
    .map(invoice => {
      const dueDate = parseInvoiceDate(invoice.dueDate);
      const daysPastDue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      return {
        invoiceId: invoice.invoiceNumber,
        supplier: invoice.supplier,
        amount: parseFloat(invoice.amountGross.replace(/,/g, "")),
        currency: invoice.currency,
        dueDate: invoice.dueDate,
        daysPastDue
      };
    });
};

// Helper function to parse date formats used in invoices
const parseInvoiceDate = (dateString: string): Date => {
  // Handle different date formats (e.g., "DD.MM.YYYY", "DD/MM/YYYY")
  const formats = [
    { regex: /^(\d{2})\.(\d{2})\.(\d{4})$/, fn: (m: RegExpMatchArray) => new Date(`${m[3]}-${m[2]}-${m[1]}`) },
    { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, fn: (m: RegExpMatchArray) => new Date(`${m[3]}-${m[2]}-${m[1]}`) },
    { regex: /^(\d{2})\/(\d{2})\/(\d{2})$/, fn: (m: RegExpMatchArray) => new Date(`20${m[3]}-${m[1]}-${m[2]}`) }
  ];

  for (const format of formats) {
    const match = dateString.match(format.regex);
    if (match) {
      return format.fn(match);
    }
  }

  // Default to parsing as-is if no recognized format
  return new Date(dateString);
};

// Calculate total debt from loans and unpaid invoices
export const calculateTotalDebt = (loans: Loan[], invoiceDebts: InvoiceDebt[]): number => {
  const loanTotal = loans.reduce((sum, loan) => sum + loan.outstandingAmount, 0);
  
  const invoiceDebtTotal = invoiceDebts.reduce((sum, debt) => {
    // Convert non-EUR currencies to EUR using fixed exchange rates
    // This is a simplified approach; in a real app you'd use current exchange rates
    let amount = debt.amount;
    if (debt.currency === "PLN") amount /= 4.3;
    if (debt.currency === "HUF") amount /= 380;
    if (debt.currency === "USD") amount *= 0.91;
    return sum + amount;
  }, 0);
  
  return loanTotal + invoiceDebtTotal;
};

// Debt service calculation (monthly debt payment obligations)
export const calculateMonthlyDebtService = (loans: Loan[]): number => {
  return loans
    .filter(loan => loan.status === "active")
    .reduce((sum, loan) => {
      if (loan.repaymentSchedule === "monthly" && loan.repaymentAmount) {
        return sum + loan.repaymentAmount;
      } else if (loan.repaymentSchedule === "quarterly" && loan.repaymentAmount) {
        return sum + (loan.repaymentAmount / 3);
      } else if (loan.repaymentSchedule === "annually" && loan.repaymentAmount) {
        return sum + (loan.repaymentAmount / 12);
      }
      return sum;
    }, 0);
};

// Add a new loan
export const addLoan = (loan: Omit<Loan, "id" | "outstandingAmount">, existingLoans: Loan[]): Loan[] => {
  const newLoan: Loan = {
    ...loan,
    id: `L${(existingLoans.length + 1).toString().padStart(3, "0")}`,
    outstandingAmount: loan.amount,
  };
  
  toast.success("Loan added successfully");
  return [...existingLoans, newLoan];
};

// Make a loan repayment
export const makeRepayment = (loanId: string, amount: number, loans: Loan[]): Loan[] => {
  return loans.map(loan => {
    if (loan.id === loanId) {
      const newOutstandingAmount = Math.max(0, loan.outstandingAmount - amount);
      const newStatus = newOutstandingAmount === 0 ? "paid" : loan.status;
      
      toast.success(`Repayment of ${amount} ${loan.currency} applied to loan ${loanId}`);
      
      return {
        ...loan,
        outstandingAmount: newOutstandingAmount,
        status: newStatus
      };
    }
    return loan;
  });
};
