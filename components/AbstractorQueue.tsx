'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Order } from '@/types';
import { Search, Filter, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function AbstractorQueue() {
  const { orders, setCurrentOrder } = useAppContext();
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    o.property.address.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reconciliation In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Abstractor Upload Needed': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Approved For Commitment': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Contract Received': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Work Queue</h1>
          <p className="text-slate-500">Manage your assigned orders and verification tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders or addresses..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-bottom border-slate-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Property Address</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">County</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Risk</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <motion.tr 
                key={order.orderId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                onClick={() => setCurrentOrder(order)}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-bold text-slate-900">{order.orderId}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{order.property.address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-500">{order.property.county}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} />
                    {new Date(order.dueAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${order.risk.overall === 'High' ? 'bg-red-500' : order.risk.overall === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="text-sm font-medium text-slate-700">{order.risk.overall}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                    Open
                    <ChevronRight size={14} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500">No orders found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
