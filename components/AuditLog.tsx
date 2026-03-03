'use client';

import React from 'react';
import { History, User, Bot, FileText } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function AuditLog() {
  const { auditLogs } = useAppContext();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
        <History className="text-slate-400" size={20} />
        Decision Log
      </h2>

      <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
        {auditLogs.map((log) => (
          <div key={log.id} className="relative pl-8">
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
              log.role === 'Smart AI' ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-slate-300'
            }`} />
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{log.action}</span>
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                  {log.source}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-2">{log.details}</p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                {log.role === 'Smart AI' ? <Bot size={12} /> : <User size={12} />}
                {log.user} ({log.role})
              </span>
            </div>

            {log.aiRecommendation && (
              <div className="mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs">
                <span className="font-bold text-indigo-700">AI Rec:</span> <span className="text-indigo-600">{log.aiRecommendation}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
