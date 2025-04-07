
import { Vendor, VendorDocument, VendorCommunication, VendorRefund, VendorAssignment, ComplianceFlag } from "@/types/vendor";
import { invoiceData } from "@/components/finance/InvoiceTable";

// Generate sample vendor data
export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Project C AB",
    contactName: "Anna Johansson",
    email: "info@projectc.se",
    phone: "+46 73 123 4567",
    address: "Götgatan 12, 118 46 Stockholm, Sweden",
    vatId: "SE559342235401",
    serviceCategories: ["Artist Booking", "Management"],
    servicesProvided: "Artist booking and management services",
    notes: "Primary contact for all Scandinavian artists",
    status: "Active",
    createdAt: "2023-01-15",
    rating: {
      reliability: 4.8,
      quality: 4.9,
      communication: 4.7,
      budgetAdherence: 4.5,
      rehireLikelihood: 5.0,
      average: 4.78
    },
    verificationStatus: "Verified"
  },
  {
    id: "v2",
    name: "Sometimescreative GmbH",
    contactName: "Markus Weber",
    email: "contact@sometimescreative.de",
    phone: "+49 30 8765432",
    address: "Torstraße 140, 10119 Berlin, Germany",
    vatId: "DE2753750632",
    serviceCategories: ["Digital Marketing", "Social Media"],
    servicesProvided: "Digital marketing and social media management",
    status: "Active",
    createdAt: "2023-03-10",
    rating: {
      reliability: 4.2,
      quality: 4.3,
      communication: 4.5,
      budgetAdherence: 4.0,
      rehireLikelihood: 4.1,
      average: 4.22
    },
    verificationStatus: "Verified"
  },
  {
    id: "v3",
    name: "DAREKRADIO Dariusz Przepióra",
    contactName: "Dariusz Przepióra",
    email: "darek@darekradio.pl",
    phone: "+48 600 123 456",
    address: "ul. Marszałkowska 126/134, 00-008 Warsaw, Poland",
    vatId: "",
    taxNumber: "1230984567",
    serviceCategories: ["Radio", "Promotion"],
    servicesProvided: "Radio promotion and advertising",
    status: "Active",
    createdAt: "2023-06-05",
    verificationStatus: "Verified"
  },
  {
    id: "v4",
    name: "Useme sp. z o.o.",
    contactName: "Jan Kowalski",
    email: "kontakt@useme.pl",
    phone: "+48 22 123 45 67",
    address: "ul. Krucza 50, 00-025 Warsaw, Poland",
    serviceCategories: ["Copywriting", "Marketing"],
    servicesProvided: "Copywriting and marketing services",
    status: "Active",
    createdAt: "2023-07-22",
    verificationStatus: "Verified"
  },
  {
    id: "v5",
    name: "MICHAŁ CYMERMAN",
    contactName: "Michał Cymerman",
    email: "michal@cymerman.pl",
    phone: "+48 500 987 654",
    address: "ul. Puławska 403, 02-801 Warsaw, Poland",
    serviceCategories: ["Technical Support", "Equipment"],
    servicesProvided: "Technical support and equipment rental",
    status: "Active",
    createdAt: "2023-05-12",
    rating: {
      reliability: 4.9,
      quality: 4.7,
      communication: 4.3,
      budgetAdherence: 4.8,
      rehireLikelihood: 4.6,
      average: 4.66
    },
    verificationStatus: "Verified"
  },
  {
    id: "v6",
    name: "Luke Slater Productions Ltd.",
    contactName: "Luke Slater",
    email: "luke@lsp.co.uk",
    phone: "+44 20 7946 0302",
    address: "124 City Road, London EC1V 2NX, UK",
    vatId: "GB691027636",
    serviceCategories: ["Artist", "Performance"],
    servicesProvided: "DJ performance and production services",
    status: "Active",
    createdAt: "2023-02-18",
    rating: {
      reliability: 5.0,
      quality: 5.0,
      communication: 4.8,
      budgetAdherence: 5.0,
      rehireLikelihood: 5.0,
      average: 4.96
    },
    verificationStatus: "Verified"
  },
  {
    id: "v7",
    name: "SoundMaster Systems",
    contactName: "Tomas Kowalczyk",
    email: "info@soundmaster.pl",
    phone: "+48 22 890 12 34",
    address: "ul. Grójecka 194, 02-390 Warsaw, Poland",
    taxNumber: "5252417723",
    serviceCategories: ["Sound", "Equipment"],
    servicesProvided: "Sound equipment rental and technical support",
    notes: "Preferred supplier for mid-size venues",
    status: "Active",
    createdAt: "2023-04-20",
    rating: {
      reliability: 4.7,
      quality: 4.8,
      communication: 4.2,
      budgetAdherence: 4.5,
      rehireLikelihood: 4.6,
      average: 4.56
    },
    verificationStatus: "Verified"
  },
  {
    id: "v8",
    name: "EventLight Productions",
    contactName: "Marta Nowak",
    email: "contact@eventlight.eu",
    phone: "+48 512 345 678",
    address: "ul. Hoża 86, 00-682 Warsaw, Poland",
    taxNumber: "7010634566",
    serviceCategories: ["Lighting", "Visual Effects"],
    servicesProvided: "Lighting design and visual effects for events",
    status: "Active",
    createdAt: "2023-01-30",
    verificationStatus: "Verified"
  },
  {
    id: "v9",
    name: "Fresh Catering",
    contactName: "Aleksandra Wiśniewska",
    email: "info@freshcatering.pl",
    phone: "+48 22 123 78 90",
    address: "ul. Mokotowska 15a, 00-640 Warsaw, Poland",
    taxNumber: "5272851322",
    serviceCategories: ["Catering", "Food"],
    servicesProvided: "Event catering services",
    status: "New",
    createdAt: "2024-01-15",
    verificationStatus: "Pending"
  },
  {
    id: "v10",
    name: "SecureStaff Group",
    contactName: "Piotr Zieliński",
    email: "security@securestaff.pl",
    phone: "+48 500 123 456",
    address: "ul. Targowa 73, 03-729 Warsaw, Poland",
    taxNumber: "7010781254",
    serviceCategories: ["Security", "Crowd Management"],
    servicesProvided: "Event security and crowd management",
    status: "Active",
    createdAt: "2023-08-05",
    rating: {
      reliability: 4.3,
      quality: 4.2,
      communication: 3.9,
      budgetAdherence: 4.7,
      rehireLikelihood: 4.1,
      average: 4.24
    },
    verificationStatus: "Verified"
  }
];

// Map sample documents to vendors
export const vendorDocuments: VendorDocument[] = [
  {
    id: "doc1",
    vendorId: "v1",
    name: "Artist Agency Contract 2024",
    type: "Contract",
    url: "#",
    uploadDate: "2024-01-10",
    expiryDate: "2024-12-31",
  },
  {
    id: "doc2",
    vendorId: "v1",
    name: "Liability Insurance",
    type: "Insurance",
    url: "#",
    uploadDate: "2024-01-15",
    expiryDate: "2025-01-14",
  },
  {
    id: "doc3",
    vendorId: "v2",
    name: "Marketing Services Agreement",
    type: "Contract",
    url: "#",
    uploadDate: "2024-02-01",
    expiryDate: "2025-01-31",
  },
  {
    id: "doc4",
    vendorId: "v6",
    name: "Artist Performance Contract",
    type: "Contract",
    url: "#",
    uploadDate: "2024-03-01",
    expiryDate: "2024-12-31",
  },
  {
    id: "doc5",
    vendorId: "v7",
    name: "Equipment Rental Terms",
    type: "Contract",
    url: "#",
    uploadDate: "2024-02-15",
    expiryDate: "2025-02-14",
  }
];

// Create communication logs
export const vendorCommunications: VendorCommunication[] = [
  {
    id: "comm1",
    vendorId: "v1",
    type: "Email",
    date: "2024-03-15",
    subject: "Booking Confirmation",
    content: "Confirmed booking for Nur Jaber at Boiler Room Warsaw",
    createdBy: "Anna Manager"
  },
  {
    id: "comm2",
    vendorId: "v2",
    type: "Meeting",
    date: "2024-02-20",
    subject: "Marketing Strategy Meeting",
    content: "Discussed digital marketing strategy for Techno Fusion Festival",
    createdBy: "Marketing Director"
  },
  {
    id: "comm3",
    vendorId: "v6",
    type: "Call",
    date: "2024-03-10",
    subject: "Technical Requirements",
    content: "Discussed technical requirements for the performance",
    createdBy: "Technical Director"
  }
];

// Create refund records
export const vendorRefunds: VendorRefund[] = [
  {
    id: "ref1",
    vendorId: "v7",
    eventId: "boiler-room",
    date: "2024-02-28",
    amount: 250,
    currency: "EUR",
    reason: "Equipment not delivered",
    status: "Processed"
  },
  {
    id: "ref2",
    vendorId: "v8",
    eventId: "tf-2025",
    date: "2024-03-05",
    amount: 180,
    currency: "EUR",
    reason: "Service quality issue",
    status: "Pending"
  }
];

// Create vendor assignments
export const vendorAssignments: VendorAssignment[] = [
  {
    id: "assign1",
    vendorId: "v1",
    eventId: "boiler-room",
    role: "Artist Booking",
    budgetedAmount: 6500,
    status: "Confirmed",
    notes: "Booking fee for the artist Nur Jaber"
  },
  {
    id: "assign2",
    vendorId: "v2",
    eventId: "tf-2025",
    role: "Digital Marketing",
    budgetedAmount: 5000,
    actualAmount: 5000,
    status: "Completed",
    notes: "Digital marketing campaign for Techno Fusion Festival"
  },
  {
    id: "assign3",
    vendorId: "v7",
    eventId: "bn-2025",
    role: "Sound System",
    budgetedAmount: 3500,
    status: "Assigned",
    notes: "Main sound system for Bass Nation event"
  },
  {
    id: "assign4",
    vendorId: "v8",
    eventId: "tf-2025",
    role: "Lighting",
    budgetedAmount: 2800,
    status: "Confirmed",
    notes: "Stage lighting for Techno Fusion Festival"
  },
  {
    id: "assign5",
    vendorId: "v10",
    eventId: "bn-2025",
    role: "Security",
    budgetedAmount: 1500,
    status: "Assigned",
    notes: "Security services for Bass Nation event"
  }
];

// Create compliance flags
export const complianceFlags: ComplianceFlag[] = [
  {
    id: "flag1",
    vendorId: "v8",
    type: "Late Delivery",
    date: "2024-02-10",
    description: "Equipment arrived 3 hours late",
    status: "Resolved",
    createdBy: "Operations Manager"
  },
  {
    id: "flag2",
    vendorId: "v9",
    type: "Missing Documents",
    date: "2024-03-01",
    description: "Health certificates not provided",
    status: "Active",
    createdBy: "Compliance Officer"
  }
];

// Map invoices to vendors
export const getVendorInvoices = () => {
  return invoiceData.map(invoice => {
    // Find matching vendor by name
    const vendor = vendors.find(v => v.name === invoice.supplier);
    return {
      ...invoice,
      vendorId: vendor ? vendor.id : null
    };
  });
};

// Map vendors to service categories
export const serviceCategories = [
  "Sound",
  "Lighting",
  "Artist Booking",
  "Management",
  "Digital Marketing",
  "Social Media",
  "Radio",
  "Promotion",
  "Copywriting",
  "Marketing",
  "Technical Support",
  "Equipment",
  "Artist",
  "Performance",
  "Visual Effects",
  "Catering",
  "Food",
  "Security",
  "Crowd Management"
];

// Get vendor statistics
export const getVendorStatistics = (vendorId: string) => {
  // Calculate vendor metrics
  const vendorInvoices = getVendorInvoices().filter(invoice => {
    const vendor = vendors.find(v => v.name === invoice.supplier);
    return vendor?.id === vendorId;
  });
  
  const assignments = vendorAssignments.filter(assignment => assignment.vendorId === vendorId);
  const refunds = vendorRefunds.filter(refund => refund.vendorId === vendorId);
  
  // Calculate total amount paid
  const totalPaid = vendorInvoices
    .filter(invoice => invoice.status === "Already paid")
    .reduce((sum, invoice) => {
      const amount = parseFloat(invoice.amountPLN.replace(/,/g, "")) || 0;
      return sum + amount;
    }, 0);
  
  // Calculate outstanding balance
  const outstandingBalance = vendorInvoices
    .filter(invoice => invoice.status !== "Already paid" && invoice.status !== "Cancelled")
    .reduce((sum, invoice) => {
      const amount = parseFloat(invoice.amountPLN.replace(/,/g, "")) || 0;
      return sum + amount;
    }, 0);
  
  // Calculate events worked on
  const eventsWorkedOn = [...new Set(assignments.map(a => a.eventId))].length;
  
  // Calculate average payment time (dummy data for now)
  const avgPaymentTime = Math.floor(Math.random() * 14) + 7; // 7-21 days
  
  return {
    totalPaid,
    outstandingBalance,
    eventsWorkedOn,
    totalInvoices: vendorInvoices.length,
    totalRefunds: refunds.length,
    avgPaymentTime
  };
};
