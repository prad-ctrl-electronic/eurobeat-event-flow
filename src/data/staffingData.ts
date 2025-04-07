
import { StaffMember, Department } from '../components/finance/budget/types';

// Sample departments data
export const departmentsData: Department[] = [
  { id: "security", name: "Security" },
  { id: "stage-management", name: "Stage Management" },
  { id: "artist-hospitality", name: "Artists Hospitality" },
  { id: "production", name: "Production" },
  { id: "logistics", name: "Logistics" },
  { id: "ticketing", name: "Ticketing" },
  { id: "foh", name: "FOH" },
  { id: "vendor-support", name: "Vendors Support" }
];

// Sample staff data
export const staffMembersData: StaffMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Event Manager",
    email: "alex@beatflow.com",
    phone: "+48 123 456 789",
    initials: "AJ",
    status: "active",
    events: 8,
    contract: "Full-time",
    nationality: "Polish",
    countryOfResidence: "Poland",
    taxId: "PL1234567890",
    payrollType: "UoP",
    rateType: "Flat",
    rateAmount: 5000,
    currency: "PLN",
    bankInfo: "PL61 1090 1014 0000 0712 1981 2874",
    skills: ["Project Management", "Budgeting", "Team Leadership"],
    languages: ["Polish", "English"],
    department: "production",
    documentsCompliance: {
      "ID": true,
      "Contract": true,
      "NDA": true,
      "Insurance": false
    },
    documentsExpiry: {
      "ID": "2028-05-15",
      "Insurance": "2024-12-31"
    }
  },
  {
    id: 2,
    name: "Maria Gonzalez",
    role: "Sound Engineer",
    email: "maria@beatflow.com",
    phone: "+48 234 567 890",
    initials: "MG",
    status: "active",
    events: 12,
    contract: "Freelance",
    nationality: "Spanish",
    countryOfResidence: "Poland",
    taxId: "ES12345678A",
    payrollType: "B2B",
    agency: "SoundCrew Agency",
    rateType: "Daily",
    rateAmount: 1200,
    currency: "PLN",
    skills: ["Sound Design", "Mixing", "Ableton Live"],
    languages: ["Spanish", "English", "Polish"],
    department: "production",
    availability: {
      blackoutDates: ["2025-07-15", "2025-07-16", "2025-07-17"]
    },
    ratings: [
      {
        reliability: 5,
        skill: 5,
        punctuality: 4,
        teamFit: 5,
        communication: 4,
        average: 4.6,
        notes: "Exceptional sound quality. Always reliable."
      }
    ]
  },
  {
    id: 3,
    name: "Daniel Weber",
    role: "Lighting Technician",
    email: "daniel@beatflow.com",
    phone: "+48 345 678 901",
    initials: "DW",
    status: "inactive",
    events: 5,
    contract: "Part-time",
    nationality: "German",
    countryOfResidence: "Germany",
    taxId: "DE12345678",
    payrollType: "UoD",
    rateType: "Hourly",
    rateAmount: 80,
    currency: "EUR",
    skills: ["Lighting Design", "DMX Programming", "Technical Support"],
    languages: ["German", "English"],
    department: "production"
  },
  {
    id: 4,
    name: "Sophie Klein",
    role: "Marketing Specialist",
    email: "sophie@beatflow.com",
    phone: "+48 456 789 012",
    initials: "SK",
    status: "active",
    events: 15,
    contract: "Full-time",
    nationality: "Polish",
    countryOfResidence: "Poland",
    taxId: "PL9876543210",
    payrollType: "UoP",
    rateType: "Flat",
    rateAmount: 4500,
    currency: "PLN",
    skills: ["Digital Marketing", "Social Media", "Content Creation"],
    languages: ["Polish", "English", "French"],
    department: "foh"
  }
];

// Sample staff assignment data (would connect to events)
export const staffAssignmentsData = [];
