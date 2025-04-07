
import { useState } from "react";

// Sample expense data
const sampleExpenses = [
  {
    id: "exp-001",
    date: "2025-03-28",
    vendor: "Sound Equipment Ltd",
    description: "Stage equipment rental",
    category: "Equipment",
    amount: 1250,
    status: "paid",
    paymentMethod: "Bank Transfer",
    event: "Techno Fusion"
  },
  {
    id: "exp-002",
    date: "2025-03-30",
    vendor: "City Hall",
    description: "Venue permit fees",
    category: "Permits",
    amount: 750,
    status: "paid",
    paymentMethod: "Credit Card",
    event: "Burn Warsaw"
  },
  {
    id: "exp-003",
    date: "2025-04-02",
    vendor: "Digital Marketing Agency",
    description: "Facebook & Instagram ads",
    category: "Marketing",
    amount: 500,
    status: "pending",
    paymentMethod: "Pending",
    event: "Boiler Room"
  },
  {
    id: "exp-004",
    date: "2025-04-03",
    vendor: "Security Services Inc",
    description: "Event security staff",
    category: "Staff",
    amount: 1800,
    status: "paid",
    paymentMethod: "Bank Transfer",
    event: "Techno Fusion"
  },
  {
    id: "exp-005",
    date: "2025-04-05",
    vendor: "Print Masters",
    description: "Event posters and flyers",
    category: "Marketing",
    amount: 320,
    status: "pending",
    paymentMethod: "Pending",
    event: "Burn Warsaw"
  }
];

export const useExpenses = () => {
  const [expenses] = useState(sampleExpenses);
  
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  return {
    expenses,
    totalAmount
  };
};
