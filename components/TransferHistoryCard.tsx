'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ShieldCheck, AlertTriangle, History, ArrowRight, GitBranch } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import BranchReferencesModal from './BranchReferencesModal';

interface TransferHistoryCardProps {
  onViewFullHistory: () => void;
  isTransferHistoryComplete?: boolean;
  areDeedsCollected?: boolean;
}

export default function TransferHistoryCard({ 
  onViewFullHistory, 
  isTransferHistoryComplete, 
  areDeedsCollected 
}: TransferHistoryCardProps) {
  const { 
    currentOrder, 
    transferHistory, 
    branchTasks,
    transferHistoryVersions
  } = useAppContext();
  
  const [showBranchModal, setShowBranchModal] = useState(false);

  if (!currentOrder) return null;

  // Filter data for current order
  const orderTransferHistory = transferHistory.filter(t => t.orderId === currentOrder.orderId);
  const orderBranchTasks = branchTasks.filter(t => t.orderId === currentOrder.orderId);
  const orderHistoryVersions = transferHistoryVersions.filter(v => v.orderId === currentOrder.orderId);

  // Snapshot Stats
  const totalTransfers = orderTransferHistory.length;
  const totalBranchRefs = orderTransferHistory.reduce((acc, t) => acc + t.branchCount, 0);
  const openBranchTasks = orderBranchTasks.filter(t => t.status !== 'Completed').length;
  const transferGapDetected = currentOrder.risk.flags.includes('ChainGapRisk');

  // Chain Coverage Calculation
  const earliestDeedDate = orderTransferHistory.length > 0 
    ? new Date(Math.min(...orderTransferHistory.map(t => new Date(t.deedDate).getTime())))
    : new Date();
  
  const yearsCovered = Math.floor((new Date().getTime() - earliestDeedDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
  const requiredBranchesCompleted = orderBranchTasks
    .filter(b => b.requiredFor42YearContinuity)
    .every(b => b.status === 'Completed');
  
  const coverageSatisfied = isTransferHistoryComplete || (yearsCovered >= 42 || (orderTransferHistory.some(t => t.legalType === 'Plat') && requiredBranchesCompleted));
  
  let coverageStatus = 'NEEDS ADDITIONAL HISTORY';
  let coverageColor = 'bg-red-50 text-red-700 border-red-100';
  let coverageIcon = <AlertTriangle size={14} />;

  if (coverageSatisfied) {
    coverageStatus = 'PASS';
    coverageColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    coverageIcon = <ShieldCheck size={14} />;
  } else if (yearsCovered < 42 && !transferGapDetected && orderTransferHistory.length > 0) {
    coverageStatus = 'Partial baseline available';
    coverageColor = 'bg-slate-100 text-slate-700 border-slate-200';
    coverageIcon = <History size={14} />;
  }

  // Recent Activity (Last 5 versions)
  const recentActivity = orderHistoryVersions.slice(0, 5);

  return (
    <div id="transfer-history" className={`bg-white border rounded-2xl p-6 shadow-sm mb-8 transition-colors ${
      coverageSatisfied ? 'border-emerald-200' : 'border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="text-indigo-600" size={20} />
            Transfer History & 42-Year Chain Coverage
          </h3>
          <div className="flex gap-4 mt-1">
            <p className="text-sm text-slate-500">
              Chain continuity and legal lineage validation for zero-claims compliance.
            </p>
            {isTransferHistoryComplete && (
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ShieldCheck size={12} />
                Auditor Verified
              </span>
            )}
            {areDeedsCollected && (
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ShieldCheck size={12} />
                Deeds Collected
              </span>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${coverageColor}`}>
          {coverageIcon}
          Coverage: {coverageStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Chain Coverage Meter */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Chain Coverage Meter</p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase mb-1">Earliest Verified Root Date</p>
                <p className="text-lg font-bold text-slate-900">
                  {orderTransferHistory.length > 0 ? earliestDeedDate.toLocaleDateString() : 'Pending from baseline parse'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase mb-1">Years Covered</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${yearsCovered >= 42 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {orderTransferHistory.length > 0 ? yearsCovered : 0}
                  </p>
                  <span className="text-xs text-slate-400 font-medium">/ 42 Years Target</span>
                </div>
                {/* Visual Meter Bar */}
                <div className="h-2 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      yearsCovered >= 42 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min((yearsCovered / 42) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {!coverageSatisfied && (
            <div className="mt-6 p-3 bg-slate-100/50 border border-slate-200 rounded-xl flex items-start gap-2">
              <History className="text-slate-500 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                {orderTransferHistory.length > 0 
                  ? "Baseline data loaded. Additional history required to meet 42-year target." 
                  : "Waiting for baseline data..."}
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Transfer Timeline Snapshot */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Transfer Timeline Snapshot</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase mb-1">Transfers</p>
                <p className="text-xl font-bold text-slate-900">{totalTransfers}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase mb-1">Branch Refs</p>
                <p className="text-xl font-bold text-slate-900">{totalBranchRefs}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase mb-1">Open Tasks</p>
                <p className={`text-xl font-bold ${openBranchTasks > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                  {openBranchTasks}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase mb-1">Gap Detected</p>
                <p className={`text-xl font-bold ${transferGapDetected ? 'text-red-600' : 'text-emerald-600'}`}>
                  {transferGapDetected ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Chain Activity</p>
                <div className="space-y-2">
                  {recentActivity.map((activity) => (
                    <div key={activity.versionId} className="flex items-center justify-between text-xs py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="font-medium text-slate-700">{activity.actionType}</span>
                      </div>
                      <span className="text-slate-400">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => setShowBranchModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <GitBranch size={16} />
              View Branch References
            </button>
            <button 
              onClick={onViewFullHistory}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              View Full Transfer History
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showBranchModal && (
          <BranchReferencesModal onClose={() => setShowBranchModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
