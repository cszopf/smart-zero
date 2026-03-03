'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function FraudRiskDashboard() {
  const { fraudSignals, addEscalation, currentOrder } = useAppContext();

  if (!currentOrder) return null;

  const orderSignals = fraudSignals.filter(s => s.orderId === currentOrder.orderId);

  if (orderSignals.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="text-red-600" size={20} />
        <h2 className="text-lg font-display font-bold text-slate-900">Fraud & Claim Risk Signals</h2>
      </div>

      <div className="space-y-4">
        {orderSignals.map(signal => (
          <div key={signal.id} className="bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase border border-red-200">
                  {signal.type}
                </span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  {signal.severity} Severity
                </span>
              </div>
              <span className="text-[10px] text-red-400 font-medium">
                Detected {new Date(signal.detectedAt).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-sm font-bold text-slate-900 mb-1">{signal.description}</p>
            <p className="text-xs text-slate-600 mb-3">Recommended: {signal.recommendedAction}</p>
            
            <button 
              onClick={() => {
                addEscalation({
                  ticketId: `ESC-${Date.now()}`,
                  orderId: currentOrder.orderId,
                  module: 'Fraud Check',
                  fieldKey: 'fraud_signal',
                  reasonCode: 'FRAUD_RISK',
                  priority: 'High',
                  description: `Fraud Signal: ${signal.description}`,
                  evidenceIds: [],
                  createdByRole: 'Examiner',
                  createdAt: new Date().toISOString(),
                  status: 'Open'
                });
              }}
              className="w-full py-2 bg-white border border-red-200 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle size={12} />
              Create Escalation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
