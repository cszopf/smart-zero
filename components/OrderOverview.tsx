'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { OrderStatus, TransferEvent, BranchTask, DeedDocument, ExtractedReference } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  AlertTriangle, 
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  MapPin,
  History,
  GitBranch,
  ExternalLink,
  Info,
  Check,
  X,
  AlertCircle,
  DollarSign,
  Calendar,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  Briefcase,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TransferHistoryCard from './TransferHistoryCard';
import TransferHistoryModal from './TransferHistoryModal';

interface OrderOverviewProps {
  onStartWork?: () => void;
}

export default function OrderOverview({ onStartWork }: OrderOverviewProps) {
  const { 
    currentOrder, 
    setCurrentOrder, 
    branchTasks, 
    transferHistory, 
    deedDocuments,
    updateBranchStatus 
  } = useAppContext();

  const [showTransferHistoryModal, setShowTransferHistoryModal] = useState(false);
  const [showAbstractorModal, setShowAbstractorModal] = useState(false);
  const [selectedAbstractor, setSelectedAbstractor] = useState('');
  const [isCoverageCollapsed, setIsCoverageCollapsed] = useState(false);
  const [expandedCoverageItem, setExpandedCoverageItem] = useState<string | null>(null);

  if (!currentOrder) return null;

  // Chain Coverage Calculation
  const earliestDeedDate = transferHistory.length > 0 
    ? new Date(Math.min(...transferHistory.map(t => new Date(t.deedDate).getTime())))
    : new Date();
  
  const yearsCovered = Math.floor((new Date().getTime() - earliestDeedDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
  const requiredBranchesCompleted = branchTasks
    .filter(b => b.requiredFor42YearContinuity)
    .every(b => b.status === 'Completed');
  
  const coverageSatisfied = (yearsCovered >= 42 || (transferHistory.some(t => t.legalType === 'Plat') && requiredBranchesCompleted));
  const coverageStatus = coverageSatisfied ? 'PASS' : 'NEEDS ADDITIONAL HISTORY';
  const chainContinuityScore = requiredBranchesCompleted ? 'High' : 'Low';

  const steps: { label: string; status: OrderStatus }[] = [
    { label: 'Contract Received', status: 'Contract Received' },
    { label: 'Searches In Progress', status: 'Searches In Progress' },
    { label: 'Upload Findings', status: 'Abstractor Upload Needed' },
    { label: 'Reconcile', status: 'Reconciliation In Progress' },
    { label: 'Submit', status: 'Submitted For Examiner Review' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === currentOrder.status) || 0;

  const handleOrderSearch = () => {
    // Mock updating status
    const updatedOrder = { ...currentOrder, status: 'Searches In Progress' as OrderStatus };
    // In a real app, this would be an API call or context update
    // For now, we'll just close the modal and maybe show a toast (omitted for brevity)
    setShowAbstractorModal(false);
    alert(`Title Search Ordered with ${selectedAbstractor}`);
    // Ideally update context here if possible, but setCurrentOrder might not be enough if it's just local state
  };

  // Logic for Auditor and Recorder status
  const auditorCheck = currentOrder.coverageChecks.find(c => c.source === 'County Auditor');
  const recorderCheck = currentOrder.coverageChecks.find(c => c.source === 'County Recorder');
  
  const isTransferHistoryComplete = auditorCheck?.status === 'Complete';
  const areDeedsCollected = recorderCheck?.status === 'Complete';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => setCurrentOrder(null)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors text-sm font-medium"
      >
        <ChevronLeft size={16} />
        Back to Queue
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                Order ID: {currentOrder.orderId}
              </span>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                currentOrder.risk.overall === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {currentOrder.risk.overall} Risk
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{currentOrder.property.address}</h1>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                {currentOrder.property.county}, {currentOrder.property.state}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                {currentOrder.property.searchWindowYears} Year Search
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
              <p className="text-lg font-bold text-slate-900">{currentOrder.status}</p>
            </div>
            
            {currentOrder.status === 'Contract Received' && (
              <div className="hidden md:block" /> /* Placeholder to keep layout if needed, or just remove */
            )}

            {currentOrder.status === 'Abstractor Upload Needed' && (
              <button 
                onClick={() => {
                  onStartWork?.();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                Input Findings
                <ArrowRight size={18} />
              </button>
            )}
            {currentOrder.status === 'Reconciliation In Progress' && (
              <button 
                onClick={() => {
                  onStartWork?.();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                Start Reconciliation
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="relative pt-4 pb-8">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2" />
          <div className="relative flex justify-between">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.label} className="flex flex-col items-center gap-3 bg-white px-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 
                    isCurrent ? 'bg-white border-slate-900 text-slate-900 shadow-lg' : 
                    'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <span className="text-sm font-bold">{idx + 1}</span>}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TransferHistoryCard 
        onViewFullHistory={() => setShowTransferHistoryModal(true)} 
        isTransferHistoryComplete={isTransferHistoryComplete}
        areDeedsCollected={areDeedsCollected}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coverage Checklist */}
        <div className="lg:col-span-2 space-y-8">
          {/* Purchase Contract Details */}
          {currentOrder.purchaseContract && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-indigo-600" size={20} />
                  Purchase Contract Details
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                  <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                    View Contract
                  </button>
                </div>
              </div>
              
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
                      &quot;{currentOrder.purchaseContract.concessions || 'None'}&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div 
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setIsCoverageCollapsed(!isCoverageCollapsed)}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" size={20} />
                <h3 className="text-lg font-bold text-slate-900">Coverage Checklist</h3>
              </div>
              <div className="flex items-center gap-3">
                {isCoverageCollapsed && (
                  <div className="flex items-center gap-1">
                    {currentOrder.coverageChecks.map((check, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${
                          check.status === 'Complete' ? 'bg-emerald-500' : 
                          check.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-300'
                        }`} 
                      />
                    ))}
                  </div>
                )}
                {isCoverageCollapsed ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronUp size={20} className="text-slate-400" />}
              </div>
            </div>
            
            <AnimatePresence>
              {!isCoverageCollapsed && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentOrder.coverageChecks.map((check) => {
                      const isExpanded = expandedCoverageItem === check.source;
                      return (
                        <div 
                          key={check.source} 
                          className={`rounded-xl border transition-all cursor-pointer ${
                            isExpanded ? 'border-slate-300 bg-slate-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                          onClick={() => setExpandedCoverageItem(isExpanded ? null : check.source)}
                        >
                          <div className="p-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{check.source}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              check.status === 'Complete' ? 'bg-emerald-100 text-emerald-700' : 
                              check.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {check.status}
                            </span>
                          </div>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-3 pb-3 border-t border-slate-200 pt-2"
                              >
                                <div className="text-xs text-slate-500 space-y-2">
                                  {check.details && (
                                    <p><span className="font-bold">Details:</span> {check.details}</p>
                                  )}
                                  {check.instrumentRef && (
                                    <p className="flex items-center gap-1">
                                      <span className="font-bold">Instrument:</span> 
                                      <span className="text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5">
                                        {check.instrumentRef}
                                        <ExternalLink size={10} />
                                      </span>
                                    </p>
                                  )}
                                  {!check.details && !check.instrumentRef && (
                                    <p className="italic text-slate-400">No additional details available.</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              Documents
            </h3>
            <div className="space-y-3">
              {currentOrder.documents.inbound.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-400">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">View</button>
                </div>
              ))}
              {currentOrder.documents.inbound.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4 italic">No documents uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Risks Panel */}
        <div className="space-y-8">
          {/* Title Manager Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="text-slate-900" size={20} />
              Title Manager
            </h3>
            
            <div className="space-y-4">
              {/* Smart AI Status */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Smart AI Search</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                        Pending
                    </span>
                 </div>
                 <p className="text-xs text-slate-500">
                    CoreLogic baseline data is available. Smart AI results will auto attach when ready.
                 </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Purchase Contract</span>
                    {currentOrder.purchaseContract ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded flex items-center gap-1">
                            <Check size={10} /> Uploaded
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                            Pending
                        </span>
                    )}
                 </div>
                 <p className="text-xs text-slate-500">
                    {currentOrder.purchaseContract ? 'Contract details extracted.' : 'Upload contract to proceed.'}
                 </p>
                 {!currentOrder.purchaseContract && (
                    <button className="w-full mt-2 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Upload size={14} />
                        Upload Contract
                    </button>
                 )}
              </div>

              {currentOrder.status === 'Contract Received' ? (
                <button 
                    onClick={() => setShowAbstractorModal(true)}
                    disabled={!currentOrder.purchaseContract}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Order Additional Search
                    <Search size={18} />
                </button>
              ) : (
                 <div className="p-3 rounded-xl bg-slate-100 text-slate-400 text-center text-sm font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    Title Search Ordered
                 </div>
              )}
            </div>
          </div>

          {/* Removed Chain Continuity Card per request */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="text-amber-600" size={20} />
              Quick Risks
            </h3>
            <div className="space-y-4">
              {currentOrder.risk.flags.map((flag) => (
                <div key={flag} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-bold text-amber-900">{flag}</p>
                    <p className="text-xs text-amber-700 mt-0.5">Requires manual verification during reconciliation.</p>
                  </div>
                </div>
              ))}
              {currentOrder.risk.flags.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={32} />
                  <p className="text-sm text-slate-500 font-medium">No immediate risks detected.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTransferHistoryModal && (
          <TransferHistoryModal onClose={() => setShowTransferHistoryModal(false)} />
        )}
      </AnimatePresence>

      {/* Abstractor Selection Modal */}
      <AnimatePresence>
        {showAbstractorModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">Order Title Search</h3>
                    <p className="text-xs text-slate-500">Assign to abstractor</p>
                  </div>
                </div>
                <button onClick={() => setShowAbstractorModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                {/* Step 1: Contract */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText size={16} className="text-indigo-600" />
                      Purchase Contract
                    </h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                      Attached
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pl-6 border-l-2 border-slate-200 ml-2">
                    <p>File: <span className="font-medium text-slate-900">Contract_{currentOrder.orderId}.pdf</span></p>
                    <p>Date: <span className="font-medium text-slate-900">{new Date(currentOrder.purchaseContract?.contractDate || '').toLocaleDateString()}</span></p>
                    <div className="flex items-center gap-1 text-emerald-600 font-medium mt-2">
                      <CheckCircle2 size={12} />
                      Details Extracted Successfully
                    </div>
                  </div>
                </div>

                {/* Step 2: Abstractor Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Abstractor</label>
                  <select 
                    value={selectedAbstractor}
                    onChange={(e) => setSelectedAbstractor(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select an abstractor...</option>
                    <option value="Abstractor A">Abstractor A (Fastest)</option>
                    <option value="Abstractor B">Abstractor B (Cheapest)</option>
                    <option value="Abstractor C">Abstractor C (Highest Rated)</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={() => setShowAbstractorModal(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleOrderSearch}
                    disabled={!selectedAbstractor}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Send Order
                    <ArrowRight size={16} />
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
