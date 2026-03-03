'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ReconciliationField, Candidate, Evidence, SourceType } from '@/types';
import { MOCK_EVIDENCE } from '@/data/mock';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  Search, 
  FileText, 
  ExternalLink,
  X,
  AlertTriangle,
  Check,
  MessageSquare,
  GitBranch,
  DollarSign,
  Calendar,
  History as HistoryIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReconciliationDashboardProps {
  onBack?: () => void;
}

export default function ReconciliationDashboard({ onBack }: ReconciliationDashboardProps) {
  const { currentOrder, reconciliationFields, setReconciliationFields, addEscalation, branchTasks, transferHistory } = useAppContext();
  const [selectedModule, setSelectedModule] = useState<string>("Current Vesting and Ownership");
  const [detailsCandidate, setDetailsCandidate] = useState<Candidate | null>(null);
  const [showEscalationModal, setShowEscalationModal] = useState<ReconciliationField | null>(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalationNote, setEscalationNote] = useState('');
  const [showContractDetails, setShowContractDetails] = useState(false);

  if (!currentOrder) return null;

  // Chain Coverage Calculation (Shared Logic)
  const earliestDeedDate = transferHistory.length > 0 
    ? new Date(Math.min(...transferHistory.map(t => new Date(t.deedDate).getTime())))
    : new Date();
  
  const yearsCovered = Math.floor((new Date().getTime() - earliestDeedDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
  const requiredBranchesCompleted = branchTasks
    .filter(b => b.requiredFor42YearContinuity)
    .every(b => b.status === 'Completed');
  
  const coverageSatisfied = (yearsCovered >= 42 || (transferHistory.some(t => t.legalType === 'Plat') && requiredBranchesCompleted));

  const modules = Array.from(new Set(reconciliationFields.filter(f => f.orderId === currentOrder.orderId).map(f => f.module)));
  const fieldsInModule = reconciliationFields.filter(f => f.orderId === currentOrder.orderId && f.module === selectedModule);

  const handleSelectFinal = (fieldKey: string, candidate: Candidate) => {
    // Validation for Legal Description: check branch tasks AND chain coverage
    if (fieldKey === 'legalDescription') {
      if (!coverageSatisfied) {
        alert(`Cannot verify Legal Description: 42-Year Chain of Title is incomplete.\n\nThe abstractor must complete the 42-year search requirement before this field can be verified.`);
        return;
      }
    }

    setReconciliationFields(prev => prev.map(f => {
      if (f.fieldKey === fieldKey && f.orderId === currentOrder.orderId) {
        // Simple logic: if another source has the same value, it's Verified, else Single Source
        const matches = f.candidates.filter(c => c.value === candidate.value).length;
        return {
          ...f,
          final: {
            ...f.final,
            value: candidate.value,
            status: matches >= 2 ? 'Verified' : 'Single Source',
            linkedEvidenceIds: candidate.evidenceIds
          }
        };
      }
      return f;
    }));
  };

  const handleEscalate = () => {
    if (!showEscalationModal) return;
    
    const ticket = {
      ticketId: `ESC-${Math.floor(Math.random() * 10000)}`,
      orderId: currentOrder.orderId,
      module: showEscalationModal.module,
      fieldKey: showEscalationModal.fieldKey,
      reasonCode: escalationReason,
      priority: 'High' as const,
      description: escalationNote,
      evidenceIds: showEscalationModal.final.linkedEvidenceIds,
      createdByRole: 'Abstractor',
      createdAt: new Date().toISOString(),
      status: 'Open' as const
    };

    addEscalation(ticket);
    
    setReconciliationFields(prev => prev.map(f => {
      if (f.fieldKey === showEscalationModal.fieldKey && f.orderId === currentOrder.orderId) {
        return { ...f, final: { ...f.final, escalated: true, status: 'Escalated' } };
      }
      return f;
    }));

    setShowEscalationModal(null);
    setEscalationReason('');
    setEscalationNote('');
  };

  const getTierColor = (tier: number, isResolved: boolean) => {
    if (isResolved) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    switch (tier) {
      case 1: return 'text-red-600 bg-red-50 border-red-100';
      case 2: return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const allTier1Resolved = coverageSatisfied && reconciliationFields
    .filter(f => f.orderId === currentOrder.orderId && f.tier === 1)
    .every(f => f.final.value !== "" && (f.final.status === 'Verified' || (f.final.status === 'Single Source' && f.final.justification) || f.final.escalated));

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Left Sidebar: Modules */}
      <aside className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-slate-200 bg-white">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <ChevronRight className="rotate-180" size={14} />
            Back to Overview
          </button>
          <h2 className="font-display font-bold text-slate-900">Modules</h2>
          <p className="text-xs text-slate-500 mt-1">Reconcile all required fields</p>
          
          {currentOrder.purchaseContract && (
            <button 
              onClick={() => setShowContractDetails(true)}
              className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors"
            >
              <FileText size={14} />
              View Purchase Contract
            </button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {modules.map(moduleName => {
            const moduleFields = reconciliationFields.filter(f => f.module === moduleName);
            const completed = moduleFields.filter(f => f.final.value !== "").length;
            const total = moduleFields.length;
            const hasTier1 = moduleFields.some(f => f.tier === 1);

            return (
              <button
                key={moduleName}
                onClick={() => setSelectedModule(moduleName)}
                className={`w-full text-left p-4 rounded-xl border transition-all group ${
                  selectedModule === moduleName 
                    ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900' 
                    : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                    hasTier1 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {hasTier1 ? 'Tier 1' : 'Tier 2'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{completed}/{total}</span>
                </div>
                <p className={`text-sm font-bold leading-tight ${selectedModule === moduleName ? 'text-slate-900' : 'text-slate-600'}`}>
                  {moduleName}
                </p>
                <div className="mt-3 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${completed === total ? 'bg-emerald-500' : 'bg-slate-400'}`}
                    style={{ width: `${(completed / total) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </nav>
        <div className="p-6 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tier 1 Ready</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${allTier1Resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {allTier1Resolved ? 'YES' : 'NO'}
            </span>
          </div>
          <button 
            disabled={!allTier1Resolved}
            title={!allTier1Resolved ? "All Tier 1 fields must be resolved and 42-Year Chain of Title must be complete." : "Submit package for review"}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              allTier1Resolved 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Verified Package
          </button>
        </div>
      </aside>

      {/* Center: Reconciliation Table */}
      <main className="flex-1 overflow-y-auto bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-slate-900">{selectedModule}</h1>
            <p className="text-slate-500">Compare candidates and select the final validated value.</p>
          </div>

          <div className="space-y-12">
            {fieldsInModule.map(field => (
              <div key={field.fieldKey} className="group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900">{field.label}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${getTierColor(field.tier, field.final.status !== 'Unresolved')}`}>
                      {field.final.status !== 'Unresolved' ? `Tier ${field.tier} Resolved` : `Tier ${field.tier}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const values = field.candidates.map(c => c.value).filter(v => v !== "");
                      const counts: Record<string, number> = {};
                      values.forEach(v => counts[v] = (counts[v] || 0) + 1);
                      const consensusValue = Object.keys(counts).find(v => counts[v] >= 2);
                      
                      if (consensusValue && field.final.value === "") {
                        return (
                          <button 
                            onClick={() => {
                              const candidate = field.candidates.find(c => c.value === consensusValue);
                              if (candidate) handleSelectFinal(field.fieldKey, candidate);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                          >
                            <Check size={12} />
                            Agreement Detected: Accept Consensus
                          </button>
                        );
                      }
                      return null;
                    })()}
                    {field.final.status !== 'Unresolved' && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        field.final.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 
                        field.final.status === 'Escalated' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {field.final.status === 'Verified' ? <Check size={12} /> : <AlertCircle size={12} />}
                        {field.final.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {field.candidates.map(candidate => {
                    const isSelected = field.final.value === candidate.value;
                    return (
                      <div 
                        key={candidate.candidateId}
                        className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-emerald-50/50 border-emerald-500 shadow-md' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                              Candidate
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              candidate.confidence === 'High' ? 'bg-emerald-50 text-emerald-600' :
                              candidate.confidence === 'Medium' ? 'bg-amber-50 text-amber-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {candidate.confidence}
                            </span>
                          </div>
                          <p className={`text-sm font-bold mb-4 break-words ${isSelected ? 'text-slate-900' : 'text-slate-900'}`}>
                            {candidate.value || <span className="italic text-slate-400 font-normal">No data provided by {candidate.sourceType === 'ABSTRACTOR' ? 'Abstractor' : 'Source'}</span>}
                          </p>
                          
                          {/* Legal Description Specific: Show linked deed/plat info */}
                          {field.fieldKey === 'legalDescription' && candidate.sourceType === 'SMART_AI' && (
                            <div className={`mt-2 p-2 rounded-lg text-[10px] ${isSelected ? 'bg-white border border-emerald-100 text-slate-500' : 'bg-slate-50 text-slate-500'}`}>
                              <p className="font-bold uppercase mb-1">Linked Evidence</p>
                              <p>Instrument: REC-2020-000111</p>
                              <p className="mt-1 italic">Extracted from primary deed</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleSelectFinal(field.fieldKey, candidate)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                              isSelected 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                          <button 
                            onClick={() => setDetailsCandidate(candidate)}
                            className={`p-2 rounded-lg transition-all ${
                              isSelected 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Info size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legal Description Specific: Branch Status Badge */}
                {field.fieldKey === 'legalDescription' && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${
                      branchTasks.every(b => b.status === 'Completed') 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <GitBranch size={14} />
                      Branch Status: {branchTasks.filter(b => b.status === 'Completed').length} / {branchTasks.length} Completed
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${
                      coverageSatisfied
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      <HistoryIcon size={14} />
                      42-Year Chain: {coverageSatisfied ? 'Complete' : 'Incomplete'}
                    </div>

                    {branchTasks.some(b => b.requiredFor42YearContinuity && b.status !== 'Completed') && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                        <AlertTriangle size={14} />
                        Required Branches Pending
                      </div>
                    )}
                  </div>
                )}

                {field.final.value && field.final.status === 'Single Source' && !field.final.escalated && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-bold text-amber-900">Single Source Verification</p>
                        <p className="text-xs text-amber-700 mt-1">
                          This value is only supported by one source. Justification or escalation is required for Tier 1 fields.
                        </p>
                        <textarea 
                          placeholder="Add justification..."
                          className="mt-3 w-full p-2 text-xs bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          rows={2}
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowEscalationModal(field)}
                      className="shrink-0 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors"
                    >
                      Escalate
                    </button>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Drawer: Details & Evidence */}
      <AnimatePresence>
        {detailsCandidate && (
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-96 border-l border-slate-200 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-display font-bold text-slate-900">Candidate Details</h2>
              <button onClick={() => setDetailsCandidate(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Source Information</p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                      <Search size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {detailsCandidate.sourceType === 'SMART_AI' ? 'Smart AI ML' : 
                         detailsCandidate.sourceType === 'COTALITY' ? 'Cotality Plant' : 'Abstractor Upload'}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        Extracted {new Date(detailsCandidate.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Evidence Traceability</p>
                <div className="space-y-4">
                  {detailsCandidate.evidenceIds.map(evId => {
                    const ev = MOCK_EVIDENCE[evId] as Evidence;
                    if (!ev) return null;
                    return (
                      <div key={evId} className="p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase">
                            {ev.docType}
                          </span>
                          <button className="text-slate-400 hover:text-slate-900 transition-colors">
                            <ExternalLink size={14} />
                          </button>
                        </div>
                        <p className="text-xs font-mono text-slate-500">{ev.docRef}</p>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-xs text-slate-600 leading-relaxed">
                          &quot;{ev.snippet}&quot;
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span>{ev.jurisdiction}</span>
                          <span>{ev.recordedDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Contract Details Modal */}
      <AnimatePresence>
        {showContractDetails && currentOrder.purchaseContract && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">Purchase Contract</h3>
                    <p className="text-xs text-slate-500">Extracted details for review</p>
                  </div>
                </div>
                <button onClick={() => setShowContractDetails(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Parties</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Seller(s)</p>
                          <p className="text-sm font-bold text-slate-900">{currentOrder.purchaseContract.sellerNames.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Buyer(s)</p>
                          <p className="text-sm font-bold text-slate-900">{currentOrder.purchaseContract.buyerNames.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Terms</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Sales Price</span>
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                          <DollarSign size={12} />
                          {currentOrder.purchaseContract.salesPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Earnest Money</span>
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                          <DollarSign size={12} />
                          {currentOrder.purchaseContract.earnestMoney.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Financing</span>
                        <span className="text-sm font-bold text-slate-900">{currentOrder.purchaseContract.terms}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Dates</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Contract Date</span>
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(currentOrder.purchaseContract.contractDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Closing Date</span>
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(currentOrder.purchaseContract.closingDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Concessions & Notes</p>
                      <p className="text-sm text-slate-700 italic">
                        &quot;{currentOrder.purchaseContract.concessions}&quot;
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => setShowContractDetails(false)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Escalation Modal */}
      <AnimatePresence>
        {showEscalationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">Escalate Risk</h3>
                    <p className="text-xs text-slate-500">Submit for Examiner review</p>
                  </div>
                </div>
                <button onClick={() => setShowEscalationModal(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason Code</label>
                  <select 
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="">Select a reason...</option>
                    <option value="Name mismatch">Name mismatch</option>
                    <option value="Possible missing release">Possible missing release</option>
                    <option value="Possible probate">Possible probate</option>
                    <option value="Possible bankruptcy">Possible bankruptcy</option>
                    <option value="Inconsistent legal description">Inconsistent legal description</option>
                    <option value="Potential fraud signal">Potential fraud signal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={escalationNote}
                    onChange={(e) => setEscalationNote(e.target.value)}
                    placeholder="Provide details for the examiner..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 min-h-[120px]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={() => setShowEscalationModal(null)}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleEscalate}
                    disabled={!escalationReason || !escalationNote}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Escalation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
