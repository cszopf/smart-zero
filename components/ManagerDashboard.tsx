'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TransferHistoryCard from './TransferHistoryCard';
import TransferHistoryModal from './TransferHistoryModal';
import OrderTitleSearchModal from './OrderTitleSearchModal';
import { Order } from '@/types';

export default function ManagerDashboard() {
  const { orders, currentOrder, addOrder } = useAppContext();
  const [showTransferHistoryModal, setShowTransferHistoryModal] = React.useState(false);
  const [showOrderModal, setShowOrderModal] = React.useState(false);

  // Mock selecting an order for demo purposes if none selected
  const displayOrder = currentOrder || orders[0];

  const handleCreateOrder = (newOrder: Order) => {
    addOrder(newOrder);
    // Optionally show a success toast or notification here
  };

  const stats = [
    { label: 'Active Orders', value: '124', change: '+12%', trend: 'up', icon: <BarChart3 className="text-blue-600" /> },
    { label: 'Avg. Recon Time', value: '4.2h', change: '-8%', trend: 'down', icon: <Clock className="text-emerald-600" /> },
    { label: 'Escalation Rate', value: '18.5%', change: '+2%', trend: 'up', icon: <AlertCircle className="text-amber-600" /> },
    { label: 'Accuracy Score', value: '99.9%', change: '0%', trend: 'neutral', icon: <CheckCircle2 className="text-purple-600" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Manager Dashboard</h1>
          <p className="text-slate-500">Performance metrics and system-wide title risk monitoring.</p>
        </div>
        <button 
          onClick={() => setShowOrderModal(true)}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          Order Title Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${
                stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : stat.trend === 'down' ? <ArrowDownRight size={14} /> : null}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Transfer History Card (Demo) */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Latest Active Order Audit</h3>
        <TransferHistoryCard onViewFullHistory={() => setShowTransferHistoryModal(true)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Workload by Abstractor</h3>
          <div className="space-y-6">
            {[
              { name: 'Abstractor #42', load: 85, status: 'Active' },
              { name: 'Abstractor #18', load: 42, status: 'Active' },
              { name: 'Abstractor #09', load: 92, status: 'At Capacity' },
              { name: 'Abstractor #55', load: 15, status: 'Available' },
            ].map(user => (
              <div key={user.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">{user.name}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    user.status === 'At Capacity' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${user.load > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${user.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl shadow-slate-900/20">
          <h3 className="text-lg font-bold mb-6">Risk Thresholds</h3>
          <div className="space-y-6">
            {[
              { label: 'Tier 1 Escalation', value: 'Automatic' },
              { label: 'Confidence Floor', value: '75%' },
              { label: 'Search Window', value: '42 Years' },
              { label: 'Audit Rate', value: '10%' },
            ].map(setting => (
              <div key={setting.label} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0">
                <span className="text-sm text-slate-400">{setting.label}</span>
                <span className="text-sm font-bold">{setting.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">
            View Full Settings
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showTransferHistoryModal && (
          <TransferHistoryModal onClose={() => setShowTransferHistoryModal(false)} />
        )}
        {showOrderModal && (
          <OrderTitleSearchModal 
            onClose={() => setShowOrderModal(false)} 
            onSubmit={handleCreateOrder}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
