export type OrderStatus = 
  | 'Contract Received'
  | 'Searches In Progress'
  | 'Abstractor Upload Needed'
  | 'Reconciliation In Progress'
  | 'Escalated To Title Team'
  | 'Submitted For Examiner Review'
  | 'Changes Requested'
  | 'Approved For Commitment'
  | 'Locked';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Property {
  address: string;
  county: string;
  state: string;
  parcelId: string;
  searchWindowYears: number;
}

export interface Parties {
  sellerName: string;
  buyerName: string;
  entityType: string;
}

export interface CoverageCheck {
  source: string;
  status: 'Pending' | 'Complete' | 'Not Applicable';
  details?: string;
  instrumentRef?: string;
}

export type ReferenceType = 
  | 'Plat Book'
  | 'Prior Deed'
  | 'Declaration'
  | 'Easement'
  | 'Restrictions'
  | 'Annexation'
  | 'Vacate'
  | 'Lot Split'
  | 'Other';

export interface ExtractedReference {
  referenceType: ReferenceType;
  citation: string;
  requiredFor42YearContinuity: boolean;
  whyItMatters?: string;
}

export interface BranchTask {
  branchId: string;
  orderId: string;
  sourceDeedInstrument: string;
  referenceType: ReferenceType;
  citation: string;
  requiredFor42YearContinuity: boolean;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Not Found';
  linkedDocumentId: string | null;
  notes: string;
}

export interface TransferEvent {
  transferId: string;
  orderId: string;
  deedDate: string;
  instrumentNumber: string;
  grantor: string;
  grantee: string;
  legalType: 'Plat' | 'Metes & Bounds' | 'Condo' | 'Replat' | 'Combination';
  containsReference: boolean;
  branchCount: number;
}

export interface DeedDocument {
  documentId: string;
  instrumentNumber: string;
  recordingDate: string;
  grantor: string;
  grantee: string;
  vestingLanguage?: string;
  legalDescriptionText: string;
  exceptionsText: string;
  hoaNames: string[];
  extractedReferences: ExtractedReference[];
}

export interface PurchaseContract {
  contractId?: string;
  contractDate: string;
  closingDate: string;
  salesPrice: number;
  earnestMoney: number;
  terms: string;
  concessions?: string;
  sellerNames: string[];
  buyerNames: string[];
  propertyAddress?: string;
  contingencies?: string[];
}

export type CureType = 
  | 'Payoff' 
  | 'Judgment' 
  | 'Lien' 
  | 'Easement' 
  | 'Tax' 
  | 'HOA' 
  | 'Bankruptcy' 
  | 'Probate' 
  | 'Chain Defect' 
  | 'Name Variance';

export type CurePriority = 'High' | 'Medium' | 'Low';

export type CureStatus = 
  | 'New' 
  | 'In Progress' 
  | 'Awaiting Docs' 
  | 'Awaiting Third Party' 
  | 'Ready to Clear' 
  | 'Resolved';

export type CureOwner = 
  | 'Examiner' 
  | 'Curative Team' 
  | 'Closer' 
  | 'Seller' 
  | 'Buyer' 
  | 'Lender' 
  | 'HOA';

export interface CureActionStep {
  stepId: string;
  description: string;
  completed: boolean;
}

export interface CureItem {
  cureId: string;
  orderId: string;
  type: CureType;
  title: string;
  priority: CurePriority;
  status: CureStatus;
  owner: CureOwner;
  daysOpen: number;
  dueDate?: string;
  
  // Tab 1: Summary
  source: string;
  recordingReference?: string;
  recordingDate?: string;
  amount?: number;
  partiesInvolved?: string[];
  propertyAffected?: string;

  // Tab 2: Required Action
  actionSteps: CureActionStep[];

  // Tab 3: Gemini Support
  geminiAnalysis?: {
    suggestedRequirement: string;
    suggestedStrategy: string;
    riskInsight: string;
  };

  // Tab 4: Documentation
  documents?: Document[];

  // New fields for MVP
  commitmentRequirement?: string;
  auditLog?: {
    timestamp: string;
    action: string;
    user: string;
  }[];

  // Section 1: Expanded Payoff & Judgment Cure Handling
  payoffInfo?: PayoffInfo;
  judgmentInfo?: JudgmentInfo;

  // Section 2: Regulatory Audit Mode
  regulatoryMetadata?: RegulatoryMetadata;
}

export interface PayoffInfo {
  loanType: 'First Mortgage' | 'Second Mortgage' | 'HELOC';
  lenderName: string;
  loanNumber: string;
  verifiedBalance?: number;
  verificationSource: 'Plaid' | 'Seller Authorization' | 'Unknown';
  sellerAuthStatus: 'Authorized' | 'Pending' | 'Not Provided';
  payoffStatus: 'Not Ordered' | 'Ordered' | 'Received' | 'Verified' | 'Cleared';
  goodThroughDate?: string;
  perDiem?: number;
  contactInfo?: {
    phone: string;
    email: string;
    fax?: string;
  };
}

export interface JudgmentInfo {
  creditorName: string;
  recordingReference: string;
  recordingDate: string;
  originalAmount: number;
  outstandingAmount?: number;
  attorneyName: string;
  attorneyContact: {
    phone: string;
    email: string;
  };
  courtInfo: string;
}

export interface RegulatoryMetadata {
  dataSource: 'CoreLogic' | 'Smart AI' | 'Abstractor Upload' | 'Examiner Finding';
  dateIdentified: string;
  identifiedBy: string;
  aiSuggestedAction?: string;
  humanDecision?: string;
  overrideNotes?: string;
}

export interface VestingValidation {
  orderId: string;
  ownerNameMatchesDeed: 'Pass' | 'Flag';
  nameVarianceDetected: 'Pass' | 'Flag';
  maritalStatusVerified: 'Pass' | 'Missing';
  llcAuthorityVerified: 'Pass' | 'Missing';
  trustCertificationRequired: 'Yes' | 'No' | 'Missing';
}

export interface PriorPolicy {
  orderId: string;
  policyNumber: string;
  companyName: string;
  effectiveDate: string;
  amount: number;
  ownerInsured: string;
  loanPolicyPresent: boolean;
  reissueEligible: boolean;
  reissueRateEstimate: number;
  exceptionsCarriedForward: string[];
}

export interface DecisionLogEntry {
  entryId: string;
  orderId: string;
  timestamp: string;
  user: string;
  action: string;
  source: string;
  notes?: string;
}


export interface Order {
  orderId: string;
  status: OrderStatus;
  createdAt: string;
  dueAt: string;
  property: Property;
  parties: Parties;
  purchaseContract?: PurchaseContract;
  coverageChecks: CoverageCheck[];
  risk: {
    overall: RiskLevel;
    flags: string[];
    chainContinuityScore?: 'Low' | 'Medium' | 'High';
  };
  documents: {
    inbound: Document[];
    abstractorUploads: Document[];
  };
  assignedAbstractorId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  url: string;
}

export type SourceType = 'SMART_AI' | 'COTALITY' | 'ABSTRACTOR';

export interface Evidence {
  evidenceId: string;
  docType: string;
  docRef: string;
  jurisdiction: string;
  recordedDate: string;
  snippet: string;
  docLink: string;
}

export interface Candidate {
  candidateId: string;
  value: string;
  confidence: 'Low' | 'Medium' | 'High';
  sourceType: SourceType;
  evidenceIds: string[];
  timestamp: string;
}

export interface ReconciliationField {
  orderId: string;
  module: string;
  tier: 1 | 2 | 3;
  fieldKey: string;
  label: string;
  candidates: Candidate[];
  final: {
    value: string;
    status: 'Unresolved' | 'Verified' | 'Single Source' | 'Escalated';
    verificationLevel: string;
    justification: string;
    linkedEvidenceIds: string[];
    escalated: boolean;
  };
}

export interface EscalationTicket {
  ticketId: string;
  orderId: string;
  module: string;
  fieldKey: string;
  reasonCode: string;
  priority: 'Normal' | 'High';
  description: string;
  evidenceIds: string[];
  createdByRole: string;
  createdAt: string;
  status: 'Open' | 'Resolved';
}

export interface TransferHistoryVersion {
  versionId: string;
  orderId: string;
  timestamp: string;
  userId: string;
  role: string;
  actionType: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  notes: string;
}

export type UserRole = 'Abstractor' | 'Title Examiner' | 'Manager';
