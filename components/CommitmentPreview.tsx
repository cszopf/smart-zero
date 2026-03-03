'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function CommitmentPreview() {
  const { currentOrder, cureItems } = useAppContext();

  if (!currentOrder) return null;

  const orderCureItems = cureItems.filter(item => item.orderId === currentOrder.orderId);
  const requirements = orderCureItems
    .filter(item => item.status !== 'Resolved' && item.commitmentRequirement)
    .map(item => item.commitmentRequirement);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit sticky top-6">
      <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FileText className="text-indigo-600" size={20} />
        Commitment Preview
      </h2>

      <div className="space-y-6">
        {/* Schedule A */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Schedule A</h3>
          <div className="space-y-2 text-xs text-slate-700">
            <p><span className="font-bold">Proposed Insured:</span> {currentOrder.purchaseContract?.buyerNames.join(', ') || 'TBD'}</p>
            <p><span className="font-bold">Sales Price:</span> ${currentOrder.purchaseContract?.salesPrice.toLocaleString() || '0.00'}</p>
            <p><span className="font-bold">Vesting:</span> Fee Simple</p>
          </div>
        </div>

        {/* Schedule B-I Requirements */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Schedule B-I Requirements</h3>
          <ul className="space-y-3">
            <li className="text-xs text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
              Payment of the full consideration to, or for the account of, the grantors or mortgagors.
            </li>
            <li className="text-xs text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
              Instruments necessary to create the estate or interest to be insured must be properly executed, delivered and duly filed for record.
            </li>
            {requirements.map((req, idx) => (
              <li key={idx} className="text-xs text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400 animate-in fade-in slide-in-from-left-2 duration-300">
                {req}
              </li>
            ))}
            {requirements.length === 0 && (
              <li className="text-xs text-emerald-600 italic pl-4 flex items-center gap-1">
                <CheckCircle2 size={10} /> No specific curative requirements remaining.
              </li>
            )}
          </ul>
        </div>

        {/* Schedule B-II Exceptions */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Schedule B-II Exceptions</h3>
          <ul className="space-y-2">
            <li className="text-xs text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
              Taxes or assessments which are not shown as existing liens by the records of any taxing authority that levies taxes or assessments on real property.
            </li>
            <li className="text-xs text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
              Any facts, rights, interests, or claims which are not shown by the public records but which could be ascertained by an inspection of the land or by making inquiry of persons in possession thereof.
            </li>
            <li className="text-xs text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
              Easements, claims of easement or encumbrances which are not shown by the public records.
            </li>
            {/* Mock Exception for the resolved easement */}
            {orderCureItems.some(i => i.type === 'Easement' && i.status === 'Resolved') && (
               <li className="text-xs text-slate-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
                 Utility Easement recorded in Instrument #2010-998877.
               </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
