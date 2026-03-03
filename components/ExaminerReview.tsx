'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Order } from '@/types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight,
  Lock,
  MessageSquare,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TransferHistoryCard from './TransferHistoryCard';
import TransferHistoryModal from './TransferHistoryModal';
import ExaminerCureCenter from './ExaminerCureCenter';
import CommitmentPreview from './CommitmentPreview';
import VestingValidationPanel from './VestingValidation';
import PriorPolicyPanel from './PriorPolicyPanel';
import PropertyEncumbrances from './PropertyEncumbrances';
import { MOCK_DECISION_LOG } from '@/data/mock';

export default function ExaminerReview() {
  const { orders, setCurrentOrder, currentOrder, reconciliationFields, escalations, cureItems } = useAppContext();
  const [activeTab, setActiveTab] = useState<'queue' | 'review'>('queue');
  const [showTransferHistoryModal, setShowTransferHistoryModal] = useState(false);
  const [showCommitmentPreview, setShowCommitmentPreview] = useState(false);

  const submittedOrders = orders.filter(o => o.status === 'Submitted For Examiner Review');

  if (currentOrder && activeTab === 'review') {
    const orderCureItems = cureItems.filter(item => item.orderId === currentOrder.orderId);
    const openCureItemsCount = orderCureItems.filter(item => item.status !== 'Resolved').length;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setActiveTab('queue')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ChevronRight className="rotate-180" size={16} />
            Back to Queue
          </button>
          <div className="flex items-center gap-4">
            {/* Commitment Preview Toggle */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              {showCommitmentPreview ? <Eye size={14} className="text-indigo-600" /> : <EyeOff size={14} className="text-slate-400" />}
              <span className="text-xs font-bold text-slate-700">Commitment Preview</span>
              <button 
                onClick={() => setShowCommitmentPreview(!showCommitmentPreview)}
                className={`w-8 h-4 rounded-full transition-colors relative ${showCommitmentPreview ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showCommitmentPreview ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {openCureItemsCount > 0 && (
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center gap-1.5">
                <AlertTriangle size={12} />
                Open curative items must be cleared before approval.
              </span>
            )}
            <button 
              disabled={openCureItemsCount > 0}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${
                openCureItemsCount > 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
              }`}
            >
              Approve For Commitment
              {openCureItemsCount === 0 && <CheckCircle2 size={16} />}
            </button>
          </div>
        </div>

        <TransferHistoryCard onViewFullHistory={() => setShowTransferHistoryModal(true)} />

        {/* Section: Liens & Encumbrances (Mortgages, Judgments, Taxes) */}
        <PropertyEncumbrances />

        {/* Section 3: Vesting & Identity Validation */}
        <VestingValidationPanel />

        {/* Section 5: Prior Title Policy */}
        <PriorPolicyPanel />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ExaminerCureCenter regulatoryAuditMode={false} />
            
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Final Validated Facts</h2>
              <div className="space-y-6">
                {reconciliationFields
                  .filter(f => f.orderId === currentOrder.orderId && f.final.value !== "")
                  .map(field => (
                  <div key={field.fieldKey} className="flex items-start justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{field.label}</p>
                      <p className="text-sm font-bold text-slate-900">{field.final.value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        field.final.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {field.final.status}
                      </span>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                        <FileText size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {reconciliationFields.filter(f => f.orderId === currentOrder.orderId && f.final.value !== "").length === 0 && (
                  <p className="text-sm text-slate-400 italic">No validated facts yet.</p>
                )}
              </div>
            </div>

            {/* Escalations moved here */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="text-red-600" size={20} />
                Escalations
              </h2>
              <div className="space-y-4">
                {escalations.filter(e => e.orderId === currentOrder.orderId).length > 0 ? (
                  escalations.filter(e => e.orderId === currentOrder.orderId).map(esc => (
                  <div key={esc.ticketId} className="p-6 rounded-2xl border border-red-100 bg-red-50/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded border border-red-200 uppercase">
                        {esc.reasonCode}
                      </span>
                      <span className="text-xs text-slate-400">{new Date(esc.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{esc.description}</p>
                    <div className="flex items-center gap-3 pt-2">
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        View Evidence
                      </button>
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                        Resolve Escalation
                      </button>
                    </div>
                  </div>
                ))) : (
                  <p className="text-sm text-slate-400 italic text-center py-8">No escalations for this order.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <AnimatePresence>
              {showCommitmentPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <CommitmentPreview />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Order Details</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Property</p>
                  <p className="text-sm font-bold">{currentOrder.property.address}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Abstractor</p>
                  <p className="text-sm font-bold">Abstractor #42</p>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <button className="w-full py-3 bg-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                    <Lock size={14} />
                    Lock File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showTransferHistoryModal && (
            <TransferHistoryModal onClose={() => setShowTransferHistoryModal(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Examiner Review Queue</h1>
          <p className="text-slate-500">Review and approve verified title packages.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search packages..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submittedOrders.map(order => (
          <motion.div 
            key={order.orderId}
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => {
              setCurrentOrder(order);
              setActiveTab('review');
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.orderId}</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                <ShieldCheck size={12} />
                Verified
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{order.property.address}</h3>
            <p className="text-xs text-slate-500 mb-6">{order.property.county}, {order.property.state}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={14} />
                Submitted 2h ago
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                Review
                <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
        {submittedOrders.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
            <CheckCircle2 className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No packages pending review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
