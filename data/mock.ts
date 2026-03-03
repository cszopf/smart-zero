import { Order, ReconciliationField, EscalationTicket, TransferEvent, BranchTask, DeedDocument, CureItem, VestingValidation, PriorPolicy, DecisionLogEntry } from '../types';

export const MOCK_CURE_ITEMS: CureItem[] = [
  // WCT-000123 Cure Items
  {
    cureId: "CURE-123-01",
    orderId: "WCT-000123",
    type: "Payoff",
    title: "Mortgage Payoff - Wells Fargo",
    priority: "High",
    status: "In Progress",
    owner: "Examiner",
    daysOpen: 3,
    source: "CoreLogic",
    recordingReference: "Bk 1234 Pg 567",
    recordingDate: "2018-05-12",
    amount: 287450.00,
    partiesInvolved: ["Wells Fargo Bank, N.A.", "John Doe"],
    propertyAffected: "Lot 4, Block 2, Sunrise Addition",
    actionSteps: [
      { stepId: "S1", description: "Order payoff statement.", completed: true },
      { stepId: "S2", description: "Verify per diem interest.", completed: false }
    ],
    geminiAnalysis: {
      suggestedRequirement: "Payoff of mortgage to Wells Fargo Bank, N.A. recorded 5/12/2018 in Book 1234 Page 567.",
      suggestedStrategy: "Standard payoff request.",
      riskInsight: "None"
    },
    commitmentRequirement: "Payoff of mortgage to Wells Fargo Bank, N.A. recorded 5/12/2018 in Book 1234 Page 567.",
    auditLog: [
      { timestamp: "2026-03-01 09:00", action: "Payoff ordered", user: "Examiner #42" }
    ],
    payoffInfo: {
      loanType: 'First Mortgage',
      lenderName: 'Wells Fargo Bank, N.A.',
      loanNumber: '****1234',
      verifiedBalance: 287450.00,
      verificationSource: 'Plaid',
      sellerAuthStatus: 'Authorized',
      payoffStatus: 'Ordered',
      goodThroughDate: '2026-03-30',
      perDiem: 45.20,
      contactInfo: {
        phone: '800-555-1234',
        email: 'payoffs@wellsfargo.com'
      }
    },
    regulatoryMetadata: {
      dataSource: 'CoreLogic',
      dateIdentified: '2026-02-27',
      identifiedBy: 'Smart AI',
      aiSuggestedAction: 'Order payoff immediately',
      humanDecision: 'Proceed with order',
    }
  },
  {
    cureId: "CURE-123-02",
    orderId: "WCT-000123",
    type: "Payoff",
    title: "Second Mortgage - Chase Bank",
    priority: "High",
    status: "New",
    owner: "Examiner",
    daysOpen: 1,
    source: "CoreLogic",
    recordingReference: "Bk 1235 Pg 100",
    recordingDate: "2020-01-15",
    amount: 0,
    partiesInvolved: ["Chase Bank", "John Doe"],
    propertyAffected: "Lot 4, Block 2, Sunrise Addition",
    actionSteps: [
      { stepId: "S1", description: "Order payoff statement.", completed: false }
    ],
    geminiAnalysis: {
      suggestedRequirement: "Payoff of second mortgage to Chase Bank recorded 1/15/2020 in Book 1235 Page 100.",
      suggestedStrategy: "Order payoff manually.",
      riskInsight: "No Plaid data available."
    },
    commitmentRequirement: "Payoff of second mortgage to Chase Bank recorded 1/15/2020 in Book 1235 Page 100.",
    auditLog: [],
    payoffInfo: {
      loanType: 'Second Mortgage',
      lenderName: 'Chase Bank',
      loanNumber: '****5678',
      verificationSource: 'Unknown',
      sellerAuthStatus: 'Not Provided',
      payoffStatus: 'Not Ordered',
      contactInfo: {
        phone: '800-555-5678',
        email: 'payoffs@chase.com'
      }
    },
    regulatoryMetadata: {
      dataSource: 'CoreLogic',
      dateIdentified: '2026-02-28',
      identifiedBy: 'Smart AI',
      aiSuggestedAction: 'Request seller authorization',
    }
  },
  {
    cureId: "CURE-123-03",
    orderId: "WCT-000123",
    type: "Judgment",
    title: "Civil Judgment - Capital Recovery Services",
    priority: "High",
    status: "Awaiting Docs",
    owner: "Curative Team",
    daysOpen: 5,
    source: "Smart AI",
    recordingReference: "2019-009881",
    recordingDate: "2019-06-15",
    amount: 8450.00,
    partiesInvolved: ["Capital Recovery Services", "John Doe"],
    propertyAffected: "All property in county",
    actionSteps: [
      { stepId: "S1", description: "Contact attorney for payoff.", completed: true },
      { stepId: "S2", description: "Obtain satisfaction of judgment.", completed: false }
    ],
    geminiAnalysis: {
      suggestedRequirement: "Satisfaction of judgment in favor of Capital Recovery Services, Case No. 2019-009881.",
      suggestedStrategy: "Negotiate settlement if possible.",
      riskInsight: "Consumer debt."
    },
    commitmentRequirement: "Satisfaction of judgment in favor of Capital Recovery Services, Case No. 2019-009881.",
    auditLog: [
      { timestamp: "2026-02-28 14:30", action: "Attorney contacted", user: "Curative Team" }
    ],
    judgmentInfo: {
      creditorName: 'Capital Recovery Services',
      recordingReference: '2019-009881',
      recordingDate: '2019-06-15',
      originalAmount: 8450.00,
      outstandingAmount: 8450.00,
      attorneyName: 'James T. Miller',
      attorneyContact: {
        phone: '614-555-9011',
        email: 'jmiller@millerstone.com'
      },
      courtInfo: 'Franklin County Common Pleas'
    },
    regulatoryMetadata: {
      dataSource: 'Smart AI',
      dateIdentified: '2026-02-27',
      identifiedBy: 'Smart AI',
      aiSuggestedAction: 'Verify statute of limitations',
      humanDecision: 'Valid judgment, require satisfaction',
    }
  },
  {
    cureId: "CURE-123-04",
    orderId: "WCT-000123",
    type: "Easement",
    title: "Utility Easement - 10ft Strip",
    priority: "Medium",
    status: "Resolved",
    owner: "Examiner",
    daysOpen: 1,
    source: "Abstractor Upload",
    recordingReference: "Inst #2010-998877",
    recordingDate: "2010-06-20",
    partiesInvolved: ["City Power & Light"],
    propertyAffected: "North 10ft of Lot 4",
    actionSteps: [
      { stepId: "S1", description: "Verify location on survey.", completed: true },
      { stepId: "S2", description: "Add to Schedule B-II.", completed: true }
    ],
    geminiAnalysis: {
      suggestedRequirement: "None - Exception only.",
      suggestedStrategy: "Show as exception.",
      riskInsight: "Standard utility easement."
    },
    commitmentRequirement: "", // Resolved items won't show in Requirements
    auditLog: [
      { timestamp: "2026-03-02 10:00", action: "Verified on survey", user: "Examiner #42" },
      { timestamp: "2026-03-02 10:05", action: "Marked Resolved", user: "Examiner #42" }
    ],
    regulatoryMetadata: {
      dataSource: 'Abstractor Upload',
      dateIdentified: '2026-02-27',
      identifiedBy: 'Abstractor',
      humanDecision: 'Accept as exception',
    }
  },
  {
    cureId: "CURE-123-05",
    orderId: "WCT-000123",
    type: "Tax",
    title: "Delinquent Taxes 2024",
    priority: "High",
    status: "New",
    owner: "Closer",
    daysOpen: 0,
    source: "CoreLogic",
    recordingReference: "Parcel #123-456-789",
    amount: 1250.00,
    partiesInvolved: ["County Treasurer"],
    propertyAffected: "Subject Property",
    actionSteps: [
      { stepId: "S1", description: "Collect at closing.", completed: false }
    ],
    geminiAnalysis: {
      suggestedRequirement: "Payment of delinquent taxes for the year 2024 in the amount of $1,250.00 plus interest and penalties.",
      suggestedStrategy: "Pay at closing.",
      riskInsight: "Tax sale risk if unpaid."
    },
    commitmentRequirement: "Payment of delinquent taxes for the year 2024 in the amount of $1,250.00 plus interest and penalties.",
    auditLog: [],
    regulatoryMetadata: {
      dataSource: 'CoreLogic',
      dateIdentified: '2026-03-02',
      identifiedBy: 'Smart AI',
    }
  },
  {
    cureId: "CURE-123-06",
    orderId: "WCT-000123",
    type: "Name Variance",
    title: "Name Variance - Doe vs. Doee",
    priority: "Low",
    status: "In Progress",
    owner: "Examiner",
    daysOpen: 2,
    source: "Examiner Finding",
    recordingReference: "Deed Bk 999 Pg 111",
    partiesInvolved: ["John Doee"],
    propertyAffected: "Subject Property",
    actionSteps: [
      { stepId: "S1", description: "Require AKA affidavit.", completed: false }
    ],
    geminiAnalysis: {
      suggestedRequirement: "Note: John Doe is also known as John Doee.",
      suggestedStrategy: "Affidavit of Identity.",
      riskInsight: "Minor typo likely."
    },
    commitmentRequirement: "Satisfactory Affidavit of Identity stating that John Doe and John Doee are one and the same person.",
    auditLog: [
      { timestamp: "2026-03-01 11:00", action: "Discrepancy noted", user: "Examiner #42" }
    ],
    regulatoryMetadata: {
      dataSource: 'Examiner Finding',
      dateIdentified: '2026-03-01',
      identifiedBy: 'Examiner #42',
      humanDecision: 'Require affidavit',
    }
  }
];

export const MOCK_VESTING_VALIDATION: VestingValidation = {
  orderId: "WCT-000123",
  ownerNameMatchesDeed: 'Pass',
  nameVarianceDetected: 'Flag',
  maritalStatusVerified: 'Pass',
  llcAuthorityVerified: 'Pass',
  trustCertificationRequired: 'No'
};

export const MOCK_PRIOR_POLICY: PriorPolicy = {
  orderId: "WCT-000123",
  policyNumber: "OP-987654321",
  companyName: "Old Republic Title",
  effectiveDate: "2020-05-12",
  amount: 325000,
  ownerInsured: "Taylor Example",
  loanPolicyPresent: true,
  reissueEligible: true,
  reissueRateEstimate: 450.00,
  exceptionsCarriedForward: [
    "Utility Easement to City Power & Light (Inst #2010-998877)",
    "Building setback line of 25 feet as shown on recorded plat"
  ]
};

export const MOCK_DECISION_LOG: DecisionLogEntry[] = [
  {
    entryId: "DL-001",
    orderId: "WCT-000123",
    timestamp: "2026-03-02 10:30",
    user: "Smart AI",
    action: "Judgment identified",
    source: "Automated Search",
    notes: "Match confidence 98%"
  },
  {
    entryId: "DL-002",
    orderId: "WCT-000123",
    timestamp: "2026-03-03 09:15",
    user: "Examiner #42",
    action: "Requirement modified",
    source: "Manual Review",
    notes: "Updated payoff amount based on new statement"
  },
  {
    entryId: "DL-003",
    orderId: "WCT-000123",
    timestamp: "2026-03-05 14:00",
    user: "Curative Team",
    action: "Payoff received and verified",
    source: "Lender Portal",
    notes: "Wire instructions confirmed"
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    orderId: "WCT-000123",
    status: "Reconciliation In Progress",
    createdAt: "2026-02-27T14:12:00Z",
    dueAt: "2026-03-01T17:00:00Z",
    property: {
      address: "123 Example St, Sampletown, OH 43000",
      county: "Example County",
      state: "OH",
      parcelId: "010-123456-789",
      searchWindowYears: 42
    },
    parties: {
      sellerName: "Taylor Example",
      buyerName: "Jordan Sample",
      entityType: "Individual"
    },
    purchaseContract: {
      contractDate: "2026-02-20",
      closingDate: "2026-03-20",
      salesPrice: 350000,
      earnestMoney: 5000,
      terms: "Conventional Loan",
      concessions: "Seller to pay $3,000 in closing costs",
      buyerNames: ["Jordan Sample"],
      sellerNames: ["Taylor Example"]
    },
    coverageChecks: [
      { source: "County Auditor", status: "Complete", details: "Tax card verified", instrumentRef: "TAX-2024-001" },
      { source: "County Recorder", status: "Complete", details: "Chain of title verified", instrumentRef: "REC-2020-000111" },
      { source: "County Treasurer", status: "Complete", details: "Taxes paid current", instrumentRef: "TR-2024-PAY" },
      { source: "Clerk of Courts", status: "Complete", details: "No pending cases found" },
      { source: "Municipal Courts", status: "Pending" },
      { source: "PACER Bankruptcy", status: "Complete", details: "No active filings" },
      { source: "State Tax Lien Public Finance", status: "Complete", details: "Clear" },
      { source: "Ohio Attorney General", status: "Complete", details: "Clear" },
      { source: "Sanctions screening", status: "Complete", details: "Clear" },
      { source: "Probate marriage", status: "Complete", details: "Clear" },
      { source: "Probate", status: "Complete", details: "Clear" }
    ],
    risk: {
      overall: "High",
      flags: ["NameVariation", "OpenMortgagePossible", "JudgmentHit", "ChainGapRisk"],
      chainContinuityScore: "Low"
    },
    documents: {
      inbound: [
        { id: "DOC-001", name: "Prior Policy.pdf", type: "Policy", uploadedAt: "2026-02-27T14:15:00Z", url: "#" },
        { id: "DOC-002", name: "Tax Map.png", type: "Map", uploadedAt: "2026-02-27T14:16:00Z", url: "#" }
      ],
      abstractorUploads: []
    }
  },
  {
    orderId: "WCT-000456",
    status: "Abstractor Upload Needed",
    createdAt: "2026-02-27T10:00:00Z",
    dueAt: "2026-03-05T17:00:00Z",
    property: {
      address: "456 Quiet Ln, Serenity, OH 44000",
      county: "Peace County",
      state: "OH",
      parcelId: "020-987654-321",
      searchWindowYears: 42
    },
    parties: {
      sellerName: "Sam Smith",
      buyerName: "Alex Jones",
      entityType: "Individual"
    },
    purchaseContract: {
      contractDate: "2026-02-15",
      closingDate: "2026-03-15",
      salesPrice: 275000,
      earnestMoney: 2500,
      terms: "FHA",
      concessions: "None",
      buyerNames: ["Alex Jones"],
      sellerNames: ["Sam Smith"]
    },
    coverageChecks: [
      { source: "County Auditor", status: "Complete" },
      { source: "County Recorder", status: "Pending" },
      { source: "County Treasurer", status: "Complete" },
      { source: "Clerk of Courts", status: "Pending" },
      { source: "Municipal Courts", status: "Pending" },
      { source: "PACER Bankruptcy", status: "Complete" },
      { source: "State Tax Lien Public Finance", status: "Complete" },
      { source: "Ohio Attorney General", status: "Complete" },
      { source: "Sanctions screening", status: "Complete" },
      { source: "Probate marriage", status: "Complete" },
      { source: "Probate", status: "Complete" }
    ],
    risk: {
      overall: "Low",
      flags: []
    },
    documents: {
      inbound: [],
      abstractorUploads: []
    }
  },
  {
    orderId: "WCT-000789",
    status: "Submitted For Examiner Review",
    createdAt: "2026-02-26T09:00:00Z",
    dueAt: "2026-03-02T17:00:00Z",
    property: {
      address: "789 Success Blvd, Clearview, OH 45000",
      county: "Hope County",
      state: "OH",
      parcelId: "030-111222-333",
      searchWindowYears: 42
    },
    parties: {
      sellerName: "Alice Clear",
      buyerName: "Bob Clean",
      entityType: "Individual"
    },
    purchaseContract: {
      contractDate: "2026-02-10",
      closingDate: "2026-03-10",
      salesPrice: 420000,
      earnestMoney: 10000,
      terms: "Cash",
      concessions: "None",
      buyerNames: ["Bob Clean"],
      sellerNames: ["Alice Clear"]
    },
    coverageChecks: [
      { source: "County Auditor", status: "Complete" },
      { source: "County Recorder", status: "Complete" },
      { source: "County Treasurer", status: "Complete" },
      { source: "Clerk of Courts", status: "Complete" },
      { source: "Municipal Courts", status: "Complete" },
      { source: "PACER Bankruptcy", status: "Complete" },
      { source: "State Tax Lien Public Finance", status: "Complete" },
      { source: "Ohio Attorney General", status: "Complete" },
      { source: "Sanctions screening", status: "Complete" },
      { source: "Probate marriage", status: "Complete" },
      { source: "Probate", status: "Complete" }
    ],
    risk: {
      overall: "Low",
      flags: []
    },
    documents: {
      inbound: [],
      abstractorUploads: []
    }
  },
  {
    orderId: "WCT-000999",
    status: "Submitted For Examiner Review",
    createdAt: "2026-02-25T08:00:00Z",
    dueAt: "2026-03-03T17:00:00Z",
    property: {
      address: "999 Risk Rd, Hazard, OH 46000",
      county: "Danger County",
      state: "OH",
      parcelId: "040-444555-666",
      searchWindowYears: 42
    },
    parties: {
      sellerName: "Sketchy LLC",
      buyerName: "Risk Taker",
      entityType: "LLC"
    },
    purchaseContract: {
      contractDate: "2026-02-05",
      closingDate: "2026-03-05",
      salesPrice: 150000,
      earnestMoney: 1000,
      terms: "Hard Money Loan",
      concessions: "Seller financing",
      buyerNames: ["Risk Taker"],
      sellerNames: ["Sketchy LLC"]
    },
    coverageChecks: [
      { source: "County Auditor", status: "Complete" },
      { source: "County Recorder", status: "Complete" },
      { source: "County Treasurer", status: "Pending" },
      { source: "Clerk of Courts", status: "Complete" },
      { source: "Municipal Courts", status: "Pending" },
      { source: "PACER Bankruptcy", status: "Complete" },
      { source: "State Tax Lien Public Finance", status: "Complete" },
      { source: "Ohio Attorney General", status: "Complete" },
      { source: "Sanctions screening", status: "Complete" },
      { source: "Probate marriage", status: "Complete" },
      { source: "Probate", status: "Complete" }
    ],
    risk: {
      overall: "High",
      flags: ["NameVariation", "OpenMortgagePossible", "JudgmentHit"]
    },
    documents: {
      inbound: [],
      abstractorUploads: []
    }
  },
  {
    orderId: "WCT-000NEW",
    status: "Contract Received",
    createdAt: "2026-03-01T08:00:00Z",
    dueAt: "2026-03-10T17:00:00Z",
    property: {
      address: "101 New Beginning Blvd, Startville, OH 45555",
      county: "Fresh County",
      state: "OH",
      parcelId: "050-777888-999",
      searchWindowYears: 42
    },
    parties: {
      sellerName: "Fresh Start LLC",
      buyerName: "New Homeowner",
      entityType: "LLC"
    },
    purchaseContract: {
      contractDate: "2026-02-28",
      closingDate: "2026-03-30",
      salesPrice: 295000,
      earnestMoney: 3000,
      terms: "Conventional",
      concessions: "None",
      buyerNames: ["New Homeowner"],
      sellerNames: ["Fresh Start LLC"]
    },
    coverageChecks: [
      { source: "County Auditor", status: "Pending" },
      { source: "County Recorder", status: "Pending" },
      { source: "County Treasurer", status: "Pending" },
      { source: "Clerk of Courts", status: "Pending" },
      { source: "Municipal Courts", status: "Pending" },
      { source: "PACER Bankruptcy", status: "Pending" },
      { source: "State Tax Lien Public Finance", status: "Pending" },
      { source: "Ohio Attorney General", status: "Pending" },
      { source: "Sanctions screening", status: "Pending" },
      { source: "Probate marriage", status: "Pending" },
      { source: "Probate", status: "Pending" }
    ],
    risk: {
      overall: "Low",
      flags: []
    },
    documents: {
      inbound: [
        { id: "DOC-NEW-001", name: "Purchase Contract.pdf", type: "Contract", uploadedAt: "2026-03-01T08:05:00Z", url: "#" }
      ],
      abstractorUploads: []
    }
  }
];

export const MOCK_TRANSFER_HISTORY: TransferEvent[] = [
  // WCT-000NEW - Partial Baseline Data
  {
    transferId: "TR-NEW-01",
    orderId: "WCT-000NEW",
    deedDate: "2024-02-15",
    instrumentNumber: "REC-2024-00111",
    grantor: "Previous Owner",
    grantee: "Fresh Start LLC",
    legalType: "Plat",
    containsReference: true,
    branchCount: 0
  },
  {
    transferId: "TR-NEW-02",
    orderId: "WCT-000NEW",
    deedDate: "2018-06-20",
    instrumentNumber: "REC-2018-00222",
    grantor: "Old Owner",
    grantee: "Previous Owner",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-NEW-03",
    orderId: "WCT-000NEW",
    deedDate: "2010-11-05",
    instrumentNumber: "REC-2010-00333",
    grantor: "Older Owner",
    grantee: "Old Owner",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-NEW-04",
    orderId: "WCT-000NEW",
    deedDate: "2008-03-12",
    instrumentNumber: "REC-2008-00444",
    grantor: "Ancient Owner",
    grantee: "Older Owner",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-NEW-05",
    orderId: "WCT-000NEW",
    deedDate: "2008-01-10",
    instrumentNumber: "REC-2008-00001",
    grantor: "Developer Inc",
    grantee: "Ancient Owner",
    legalType: "Plat",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-NEW-06",
    orderId: "WCT-000NEW",
    deedDate: "2008-01-01", // Approx 18 years ago from 2026
    instrumentNumber: "REC-2008-00000",
    grantor: "Farm Land Co",
    grantee: "Developer Inc",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },

  // WCT-000123 - Complete 42 Year Chain
  {
    transferId: "TR-001",
    orderId: "WCT-000123",
    deedDate: "2020-05-12",
    instrumentNumber: "REC-2020-000111",
    grantor: "Sample Developer LLC",
    grantee: "Taylor Example",
    legalType: "Plat",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-002",
    orderId: "WCT-000123",
    deedDate: "2015-08-22",
    instrumentNumber: "REC-2015-004567",
    grantor: "Old Farm Estates Inc",
    grantee: "Sample Developer LLC",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 2
  },
  {
    transferId: "TR-003",
    orderId: "WCT-000123",
    deedDate: "1998-03-15",
    instrumentNumber: "VOL-2345-PG-112",
    grantor: "John & Jane Farmer",
    grantee: "Old Farm Estates Inc",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-004",
    orderId: "WCT-000123",
    deedDate: "1985-11-30",
    instrumentNumber: "VOL-1890-PG-445",
    grantor: "Original Pioneer Family Trust",
    grantee: "John & Jane Farmer",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-005",
    orderId: "WCT-000123",
    deedDate: "1972-06-10",
    instrumentNumber: "VOL-1200-PG-055",
    grantor: "Historic Land Grant",
    grantee: "Original Pioneer Family Trust",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },

  // WCT-000456 - Complete 42 Year Chain
  {
    transferId: "TR-456-01",
    orderId: "WCT-000456",
    deedDate: "2018-04-10",
    instrumentNumber: "REC-2018-00555",
    grantor: "Peaceful Living Developers",
    grantee: "Sam Smith",
    legalType: "Plat",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-456-02",
    orderId: "WCT-000456",
    deedDate: "2010-09-15",
    instrumentNumber: "REC-2010-00123",
    grantor: "Serenity Farms Inc",
    grantee: "Peaceful Living Developers",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-456-03",
    orderId: "WCT-000456",
    deedDate: "1990-06-20",
    instrumentNumber: "VOL-1500-PG-200",
    grantor: "Old Man Winter",
    grantee: "Serenity Farms Inc",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-456-04",
    orderId: "WCT-000456",
    deedDate: "1975-02-14",
    instrumentNumber: "VOL-1000-PG-100",
    grantor: "Original Settler Family",
    grantee: "Old Man Winter",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 1
  },

  // WCT-000999 - Complete 42 Year Chain (High Risk)
  {
    transferId: "TR-999-01",
    orderId: "WCT-000999",
    deedDate: "2023-11-01",
    instrumentNumber: "REC-2023-00666",
    grantor: "Quick Flip LLC",
    grantee: "Sketchy LLC",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 0
  },
  {
    transferId: "TR-999-02",
    orderId: "WCT-000999",
    deedDate: "2023-05-01",
    instrumentNumber: "REC-2023-00111",
    grantor: "Distressed Owner",
    grantee: "Quick Flip LLC",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-999-03",
    orderId: "WCT-000999",
    deedDate: "2005-08-15",
    instrumentNumber: "REC-2005-00999",
    grantor: "Long Time Resident",
    grantee: "Distressed Owner",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-999-04",
    orderId: "WCT-000999",
    deedDate: "1980-01-20",
    instrumentNumber: "VOL-0800-PG-400",
    grantor: "Original Developer",
    grantee: "Long Time Resident",
    legalType: "Plat",
    containsReference: true,
    branchCount: 1
  },

  // WCT-000789 - Full 42 Year Chain
  {
    transferId: "TR-789-01",
    orderId: "WCT-000789",
    deedDate: "2024-01-15",
    instrumentNumber: "INST-2024-00123",
    grantor: "Previous Owner LLC",
    grantee: "Alice Clear",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-789-02",
    orderId: "WCT-000789",
    deedDate: "2015-06-20",
    instrumentNumber: "INST-2015-09876",
    grantor: "Old Family Trust",
    grantee: "Previous Owner LLC",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-789-03",
    orderId: "WCT-000789",
    deedDate: "1998-11-05",
    instrumentNumber: "VOL-1234-PG-567",
    grantor: "Original Farmer",
    grantee: "Old Family Trust",
    legalType: "Metes & Bounds",
    containsReference: true,
    branchCount: 1
  },
  {
    transferId: "TR-789-04",
    orderId: "WCT-000789",
    deedDate: "1980-03-12",
    instrumentNumber: "VOL-0987-PG-654",
    grantor: "Pioneer Land Co",
    grantee: "Original Farmer",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  },
  {
    transferId: "TR-789-05",
    orderId: "WCT-000789",
    deedDate: "1965-09-22",
    instrumentNumber: "VOL-0500-PG-300",
    grantor: "State Land Office",
    grantee: "Pioneer Land Co",
    legalType: "Metes & Bounds",
    containsReference: false,
    branchCount: 0
  }
];

export const MOCK_DEED_DOCUMENTS: DeedDocument[] = [
  {
    documentId: "DOC-DEED-001",
    instrumentNumber: "REC-2020-000111",
    recordingDate: "2020-05-12",
    grantor: "Sample Developer LLC",
    grantee: "Taylor Example",
    vestingLanguage: "Taylor Example, an unmarried person",
    legalDescriptionText: "Lot 12 of Sample Subdivision as recorded in Plat Book 12, Page 44 of the County Recorder's Office.",
    exceptionsText: "Subject to easements, restrictions, and reservations of record.",
    hoaNames: ["Sample HOA Association"],
    extractedReferences: [
      {
        referenceType: "Plat Book",
        citation: "Plat Book 12, Page 44",
        requiredFor42YearContinuity: true,
        whyItMatters: "References the underlying subdivision plat which establishes the property's legal lineage."
      }
    ]
  }
];

export const MOCK_BRANCH_TASKS: BranchTask[] = [
  {
    branchId: "BR-NEW-01",
    orderId: "WCT-000NEW",
    sourceDeedInstrument: "REC-2018-00222",
    referenceType: "Plat Book",
    citation: "Plat Book 5, Page 10",
    requiredFor42YearContinuity: true,
    status: "Pending",
    linkedDocumentId: null,
    notes: "Baseline reference found"
  },
  {
    branchId: "BR-NEW-02",
    orderId: "WCT-000NEW",
    sourceDeedInstrument: "REC-2008-00444",
    referenceType: "Prior Deed",
    citation: "Vol 100, Page 50",
    requiredFor42YearContinuity: false,
    status: "Pending",
    linkedDocumentId: null,
    notes: "Baseline reference found"
  },
  {
    branchId: "BR-001",
    orderId: "WCT-000123",
    sourceDeedInstrument: "REC-2020-000111",
    referenceType: "Plat Book",
    citation: "Plat Book 12, Page 44",
    requiredFor42YearContinuity: true,
    status: "Pending",
    linkedDocumentId: null,
    notes: ""
  }
];

export const MOCK_RECONCILIATION_FIELDS: ReconciliationField[] = [
  // Order WCT-000123 (In Progress)
  {
    orderId: "WCT-000123",
    module: "Legal Description and Property Identity",
    tier: 1,
    fieldKey: "legalDescription",
    label: "Full legal description",
    candidates: [
      { candidateId: "CL1", value: "Lot 12 of Sample Subdivision as recorded in Plat Book 12, Page 44...", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-001"], timestamp: "2026-02-27T14:20:00Z" },
      { candidateId: "CL2", value: "Lot 12 of Sample Subdivision...", confidence: "High", sourceType: "COTALITY", evidenceIds: ["EV-101"], timestamp: "2026-02-27T14:21:00Z" },
      { candidateId: "CL3", value: "", confidence: "High", sourceType: "ABSTRACTOR", evidenceIds: ["EV-201"], timestamp: "2026-02-27T14:22:00Z" }
    ],
    final: {
      value: "",
      status: "Unresolved",
      verificationLevel: "",
      justification: "",
      linkedEvidenceIds: [],
      escalated: false
    }
  },
  {
    orderId: "WCT-000123",
    module: "Current Vesting and Ownership",
    tier: 1,
    fieldKey: "currentOwnerName",
    label: "Current owner name",
    candidates: [
      { candidateId: "C1", value: "Taylor Example", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-001"], timestamp: "2026-02-27T14:20:00Z" },
      { candidateId: "C2", value: "Taylor A. Example", confidence: "Medium", sourceType: "COTALITY", evidenceIds: ["EV-101"], timestamp: "2026-02-27T14:21:00Z" },
      { candidateId: "C3", value: "", confidence: "High", sourceType: "ABSTRACTOR", evidenceIds: ["EV-201"], timestamp: "2026-02-27T14:22:00Z" }
    ],
    final: {
      value: "",
      status: "Unresolved",
      verificationLevel: "",
      justification: "",
      linkedEvidenceIds: [],
      escalated: false
    }
  },
  {
    orderId: "WCT-000123",
    module: "Recorder Chain and Open Mortgages",
    tier: 1,
    fieldKey: "releaseStatus",
    label: "Release or satisfaction status",
    candidates: [
      { candidateId: "C4", value: "Open", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-002"], timestamp: "2026-02-27T14:20:00Z" },
      { candidateId: "C5", value: "Open", confidence: "High", sourceType: "COTALITY", evidenceIds: ["EV-102"], timestamp: "2026-02-27T14:21:00Z" },
      { candidateId: "C6", value: "", confidence: "Medium", sourceType: "ABSTRACTOR", evidenceIds: ["EV-202"], timestamp: "2026-02-27T14:22:00Z" }
    ],
    final: {
      value: "",
      status: "Unresolved",
      verificationLevel: "",
      justification: "",
      linkedEvidenceIds: [],
      escalated: false
    }
  },
  {
    orderId: "WCT-000123",
    module: "Judgments and Liens",
    tier: 1,
    fieldKey: "clerkJudgments",
    label: "Clerk of courts judgments",
    candidates: [
      { candidateId: "C7", value: "Possible Hit: 2024-CV-001", confidence: "Medium", sourceType: "SMART_AI", evidenceIds: ["EV-003"], timestamp: "2026-02-27T14:20:00Z" },
      { candidateId: "C8", value: "No Hits", confidence: "High", sourceType: "COTALITY", evidenceIds: ["EV-103"], timestamp: "2026-02-27T14:21:00Z" },
      { candidateId: "C9", value: "", confidence: "High", sourceType: "ABSTRACTOR", evidenceIds: ["EV-203"], timestamp: "2026-02-27T14:22:00Z" }
    ],
    final: {
      value: "",
      status: "Unresolved",
      verificationLevel: "",
      justification: "",
      linkedEvidenceIds: [],
      escalated: false
    }
  },
  {
    orderId: "WCT-000123",
    module: "Taxes and Treasurer",
    tier: 1,
    fieldKey: "taxDelinquency",
    label: "Delinquency status",
    candidates: [
      { candidateId: "C10", value: "Current", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-004"], timestamp: "2026-02-27T14:20:00Z" },
      { candidateId: "C11", value: "Current", confidence: "High", sourceType: "COTALITY", evidenceIds: ["EV-104"], timestamp: "2026-02-27T14:21:00Z" },
      { candidateId: "C12", value: "", confidence: "High", sourceType: "ABSTRACTOR", evidenceIds: ["EV-204"], timestamp: "2026-02-27T14:22:00Z" }
    ],
    final: {
      value: "",
      status: "Unresolved",
      verificationLevel: "",
      justification: "",
      linkedEvidenceIds: [],
      escalated: false
    }
  },
  {
    orderId: "WCT-000123",
    module: "Bankruptcy",
    tier: 1,
    fieldKey: "pacerMatch",
    label: "PACER match indicator",
    candidates: [
      { candidateId: "C13", value: "No Match", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-005"], timestamp: "2026-02-27T14:20:00Z" },
      { candidateId: "C14", value: "No Match", confidence: "High", sourceType: "COTALITY", evidenceIds: ["EV-105"], timestamp: "2026-02-27T14:21:00Z" },
      { candidateId: "C15", value: "", confidence: "High", sourceType: "ABSTRACTOR", evidenceIds: ["EV-205"], timestamp: "2026-02-27T14:22:00Z" }
    ],
    final: {
      value: "",
      status: "Unresolved",
      verificationLevel: "",
      justification: "",
      linkedEvidenceIds: [],
      escalated: false
    }
  },

  // Order WCT-000789 (Success - Reviewed)
  {
    orderId: "WCT-000789",
    module: "Current Vesting and Ownership",
    tier: 1,
    fieldKey: "currentOwnerName",
    label: "Current owner name",
    candidates: [
      { candidateId: "S1", value: "Alice Clear", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-S1"], timestamp: "2026-02-26T10:00:00Z" },
      { candidateId: "S2", value: "Alice Clear", confidence: "High", sourceType: "COTALITY", evidenceIds: ["EV-S2"], timestamp: "2026-02-26T10:01:00Z" }
    ],
    final: {
      value: "Alice Clear",
      status: "Verified",
      verificationLevel: "Level 1",
      justification: "Matches both sources",
      linkedEvidenceIds: ["EV-S1", "EV-S2"],
      escalated: false
    }
  },
  {
    orderId: "WCT-000789",
    module: "Recorder Chain and Open Mortgages",
    tier: 1,
    fieldKey: "releaseStatus",
    label: "Release or satisfaction status",
    candidates: [
      { candidateId: "S3", value: "Released", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-S3"], timestamp: "2026-02-26T10:00:00Z" },
      { candidateId: "S4", value: "Released", confidence: "High", sourceType: "COTALITY", evidenceIds: ["EV-S4"], timestamp: "2026-02-26T10:01:00Z" }
    ],
    final: {
      value: "Released",
      status: "Verified",
      verificationLevel: "Level 1",
      justification: "Confirmed release recorded",
      linkedEvidenceIds: ["EV-S3", "EV-S4"],
      escalated: false
    }
  },

  // Order WCT-000999 (Flagged - Escalated)
  {
    orderId: "WCT-000999",
    module: "Current Vesting and Ownership",
    tier: 1,
    fieldKey: "currentOwnerName",
    label: "Current owner name",
    candidates: [
      { candidateId: "F1", value: "Sketchy LLC", confidence: "Low", sourceType: "SMART_AI", evidenceIds: ["EV-F1"], timestamp: "2026-02-25T09:00:00Z" },
      { candidateId: "F2", value: "Sketchy Limited", confidence: "Low", sourceType: "COTALITY", evidenceIds: ["EV-F2"], timestamp: "2026-02-25T09:01:00Z" }
    ],
    final: {
      value: "Sketchy LLC",
      status: "Single Source",
      verificationLevel: "Level 2",
      justification: "Name variation found",
      linkedEvidenceIds: ["EV-F1"],
      escalated: false
    }
  },
  {
    orderId: "WCT-000999",
    module: "Recorder Chain and Open Mortgages",
    tier: 1,
    fieldKey: "releaseStatus",
    label: "Release or satisfaction status",
    candidates: [
      { candidateId: "F3", value: "Open", confidence: "High", sourceType: "SMART_AI", evidenceIds: ["EV-F3"], timestamp: "2026-02-25T09:00:00Z" },
      { candidateId: "F4", value: "Unknown", confidence: "Low", sourceType: "COTALITY", evidenceIds: [], timestamp: "2026-02-25T09:01:00Z" }
    ],
    final: {
      value: "Open",
      status: "Escalated",
      verificationLevel: "Level 3",
      justification: "Missing release for prior mortgage",
      linkedEvidenceIds: ["EV-F3"],
      escalated: true
    }
  }
];

export const MOCK_EVIDENCE: Record<string, any> = {
  "EV-001": {
    evidenceId: "EV-001",
    docType: "Recorded Deed",
    docRef: "REC-2020-000111",
    jurisdiction: "Example County Recorder",
    recordedDate: "2020-05-12",
    snippet: "Grantor conveys to Taylor Example, an unmarried person...",
    docLink: "#"
  },
  "EV-101": {
    evidenceId: "EV-101",
    docType: "Tax Record",
    docRef: "TAX-2024-999",
    jurisdiction: "Example County Auditor",
    recordedDate: "2024-01-15",
    snippet: "Owner of Record: Taylor A. Example",
    docLink: "#"
  },
  "EV-201": {
    evidenceId: "EV-201",
    docType: "Abstractor Search",
    docRef: "ABS-123-VEST",
    jurisdiction: "Example County",
    recordedDate: "2026-02-27",
    snippet: "Verified vesting in Taylor Example via deed REC-2020-000111",
    docLink: "#"
  }
};
