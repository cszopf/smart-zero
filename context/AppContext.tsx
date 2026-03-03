'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Order, ReconciliationField, EscalationTicket, BranchTask, TransferEvent, DeedDocument, TransferHistoryVersion, CureItem, AuditLogEntry, FraudSignal, ProductivityMetric } from '../types';
import { MOCK_ORDERS, MOCK_RECONCILIATION_FIELDS, MOCK_BRANCH_TASKS, MOCK_TRANSFER_HISTORY, MOCK_DEED_DOCUMENTS, MOCK_CURE_ITEMS } from '../data/mock';

interface AppContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  reconciliationFields: ReconciliationField[];
  setReconciliationFields: React.Dispatch<React.SetStateAction<ReconciliationField[]>>;
  updateAbstractorFindings: (findings: Record<string, string>) => void;
  escalations: EscalationTicket[];
  addEscalation: (ticket: EscalationTicket) => void;
  branchTasks: BranchTask[];
  transferHistory: TransferEvent[];
  deedDocuments: DeedDocument[];
  updateBranchStatus: (branchId: string, status: BranchTask['status'], linkedDocId?: string) => void;
  transferHistoryVersions: TransferHistoryVersion[];
  addTransferHistoryVersion: (version: TransferHistoryVersion) => void;
  addOrder: (order: Order) => void;
  cureItems: CureItem[];
  updateCureItem: (cureId: string, updates: Partial<CureItem>) => void;
  auditMode: boolean;
  toggleAuditMode: () => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: AuditLogEntry) => void;
  fraudSignals: FraudSignal[];
  productivityMetrics: ProductivityMetric[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [reconciliationFields, setReconciliationFields] = useState<ReconciliationField[]>(MOCK_RECONCILIATION_FIELDS);
  const [escalations, setEscalations] = useState<EscalationTicket[]>([]);
  
  // New state for Transfer History
  const [branchTasks, setBranchTasks] = useState<BranchTask[]>(MOCK_BRANCH_TASKS || []);
  const [transferHistory, setTransferHistory] = useState<TransferEvent[]>(MOCK_TRANSFER_HISTORY || []);
  const [deedDocuments, setDeedDocuments] = useState<DeedDocument[]>(MOCK_DEED_DOCUMENTS || []);
  const [transferHistoryVersions, setTransferHistoryVersions] = useState<TransferHistoryVersion[]>([]);
  const [cureItems, setCureItems] = useState<CureItem[]>(MOCK_CURE_ITEMS || []);

  // New state for Examiner Demo
  const [auditMode, setAuditMode] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'LOG-001',
      orderId: 'ORD-2024-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      user: 'System',
      role: 'Smart AI',
      action: 'Risk Assessment',
      details: 'Identified potential gap in chain of title (1998-2002)',
      source: 'Smart AI',
      aiRecommendation: 'Flag for manual review',
      humanDecision: 'Flagged'
    },
    {
      id: 'LOG-002',
      orderId: 'ORD-2024-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      user: 'Jane Doe',
      role: 'Abstractor',
      action: 'Document Upload',
      details: 'Uploaded missing deed Book 123 Page 456',
      source: 'Abstractor Upload'
    }
  ]);
  const [fraudSignals, setFraudSignals] = useState<FraudSignal[]>([
    {
      id: 'FRAUD-001',
      orderId: 'ORD-2024-001',
      type: 'Rapid Transfer',
      severity: 'Medium',
      description: 'Property transferred 2 times in last 90 days',
      detectedAt: new Date().toISOString(),
      status: 'Active',
      recommendedAction: 'Verify consideration and relationship between parties'
    }
  ]);
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetric[]>([
    { metric: 'Avg Cure Time', value: '1.2 days', trend: 'down', trendValue: '12%' },
    { metric: 'Items / File', value: 3.4, trend: 'neutral', trendValue: '0%' },
    { metric: 'Override Rate', value: '4.5%', trend: 'down', trendValue: '2%' },
    { metric: 'AI Acceptance', value: '94%', trend: 'up', trendValue: '5%' }
  ]);

  const toggleAuditMode = () => setAuditMode(prev => !prev);
  
  const addAuditLog = (entry: AuditLogEntry) => {
    setAuditLogs(prev => [entry, ...prev]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateCureItem = (cureId: string, updates: Partial<CureItem>) => {
    setCureItems(prev => prev.map(item => 
      item.cureId === cureId ? { ...item, ...updates } : item
    ));
  };

  const addEscalation = (ticket: EscalationTicket) => {
    setEscalations(prev => [...prev, ticket]);

    // Add version log for Transfer History tracking
    const version: TransferHistoryVersion = {
      // eslint-disable-next-line react-hooks/purity
      versionId: `VER-${Date.now()}`,
      orderId: ticket.orderId,
      timestamp: new Date().toISOString(),
      userId: 'CURRENT_USER',
      role: role || 'Abstractor',
      actionType: 'Escalation Created',
      fieldChanged: `${ticket.module}.${ticket.fieldKey}`,
      previousValue: 'None',
      newValue: 'Escalated',
      notes: ticket.description
    };
    addTransferHistoryVersion(version);
  };

  const updateBranchStatus = (branchId: string, status: BranchTask['status'], linkedDocId?: string) => {
    setBranchTasks(prev => prev.map(task => {
      if (task.branchId === branchId) {
        const oldStatus = task.status;
        // Create version entry
        const version: TransferHistoryVersion = {
          versionId: `VER-${Date.now()}`,
          orderId: currentOrder?.orderId || '',
          timestamp: new Date().toISOString(),
          userId: 'CURRENT_USER', // In real app, get from auth
          role: role || 'Abstractor',
          actionType: `Branch Marked ${status}`,
          fieldChanged: `branch-${branchId}.status`,
          previousValue: oldStatus,
          newValue: status,
          notes: 'Status updated via Transfer History'
        };
        addTransferHistoryVersion(version);
        
        return { ...task, status, linkedDocumentId: linkedDocId || task.linkedDocumentId };
      }
      return task;
    }));
  };

  const addTransferHistoryVersion = (version: TransferHistoryVersion) => {
    setTransferHistoryVersions(prev => [version, ...prev]);
  };

  const updateAbstractorFindings = (findings: Record<string, string>) => {
    setReconciliationFields(prev => prev.map(field => {
      const newValue = findings[field.fieldKey];
      if (newValue !== undefined) {
        return {
          ...field,
          candidates: field.candidates.map(candidate => {
            if (candidate.sourceType === 'ABSTRACTOR') {
              return { ...candidate, value: newValue, timestamp: new Date().toISOString() };
            }
            return candidate;
          })
        };
      }
      return field;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      role, 
      setRole, 
      orders, 
      currentOrder, 
      setCurrentOrder,
      reconciliationFields,
      setReconciliationFields,
      updateAbstractorFindings,
      escalations,
      addEscalation,
      branchTasks,
      transferHistory,
      deedDocuments,
      updateBranchStatus,
      transferHistoryVersions,
      addTransferHistoryVersion,
      addOrder,
      cureItems,
      updateCureItem,
      auditMode,
      toggleAuditMode,
      auditLogs,
      addAuditLog,
      fraudSignals,
      productivityMetrics
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
