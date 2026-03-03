'use client';

import React, { useState, useRef } from 'react';
import { X, Building2, User, Calendar, DollarSign, FileText, Upload, Check, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus } from '@/types';

interface OrderTitleSearchModalProps {
  onClose: () => void;
  onSubmit: (order: Order) => void;
}

const MOCK_ABSTRACTORS = [
  { id: 'ABS-001', name: 'Sarah Jenkins', company: 'Jenkins Title Services', rating: 4.8 },
  { id: 'ABS-002', name: 'Mike Ross', company: 'Pearson Specter Title', rating: 4.5 },
  { id: 'ABS-003', name: 'FastTrack Abstractors', company: 'FastTrack Inc.', rating: 4.2 },
  { id: 'ABS-004', name: 'Global Title Search', company: 'Global Title', rating: 4.9 },
];

export default function OrderTitleSearchModal({ onClose, onSubmit }: OrderTitleSearchModalProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    address: '',
    county: '',
    state: '',
    parcelId: '',
    sellerName: '',
    buyerName: '',
    salesPrice: '',
    earnestMoney: '',
    closingDate: '',
    abstractorId: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      simulateExtraction(file);
    }
  };

  const simulateExtraction = (file: File) => {
    setIsExtracting(true);
    setUploadSuccess(false);

    // Simulate AI extraction delay
    setTimeout(() => {
      setIsExtracting(false);
      setUploadSuccess(true);
      
      // Mock extracted data
      setFormData(prev => ({
        ...prev,
        address: '742 Evergreen Terrace, Springfield',
        county: 'Shelby',
        state: 'IL',
        parcelId: '07-12-345-678',
        sellerName: 'Homer J. Simpson',
        buyerName: 'Ned Flanders',
        salesPrice: '250000',
        earnestMoney: '5000',
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a random Order ID (in a real app this would be from DB)
    const orderId = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const newOrder: Order = {
      orderId,
      status: 'Contract Received' as OrderStatus,
      createdAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      assignedAbstractorId: formData.abstractorId,
      property: {
        address: formData.address,
        county: formData.county,
        state: formData.state,
        parcelId: formData.parcelId,
        searchWindowYears: 40 // Default
      },
      parties: {
        sellerName: formData.sellerName,
        buyerName: formData.buyerName,
        entityType: 'Individual' // Default
      },
      purchaseContract: {
        contractDate: new Date().toISOString(),
        closingDate: formData.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        salesPrice: Number(formData.salesPrice) || 0,
        earnestMoney: Number(formData.earnestMoney) || 0,
        terms: 'Standard',
        sellerNames: [formData.sellerName],
        buyerNames: [formData.buyerName]
      },
      coverageChecks: [],
      risk: {
        overall: 'Low',
        flags: []
      },
      documents: {
        inbound: selectedFile ? [{
          id: `DOC-${Date.now()}`,
          name: selectedFile.name,
          type: 'Purchase Contract',
          uploadedAt: new Date().toISOString(),
          url: '#'
        }] : [],
        abstractorUploads: []
      }
    };

    onSubmit(newOrder);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">Order Title Search</h2>
            <p className="text-sm text-slate-500">Upload contract to auto-fill or enter details manually.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="order-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Upload Section */}
            <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50 group cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
              />
              
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isExtracting ? (
                    <Loader2 className="text-blue-600 animate-spin" size={24} />
                  ) : uploadSuccess ? (
                    <Check className="text-emerald-600" size={24} />
                  ) : (
                    <Upload className="text-blue-600" size={24} />
                  )}
                </div>
                
                <div>
                  {isExtracting ? (
                    <>
                      <h3 className="font-bold text-blue-900">Extracting Data...</h3>
                      <p className="text-sm text-blue-600">Analyzing purchase contract</p>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <h3 className="font-bold text-emerald-900">Extraction Complete</h3>
                      <p className="text-sm text-emerald-600">{selectedFile?.name}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-slate-900">Upload Purchase Contract</h3>
                      <p className="text-sm text-slate-500">Drag & drop or click to browse</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Property Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                    <Building2 size={18} className="text-blue-600" />
                    <h3>Property Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Property Address</label>
                      <input 
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St, City, Zip"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">County</label>
                        <input 
                          required
                          name="county"
                          value={formData.county}
                          onChange={handleChange}
                          placeholder="County"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">State</label>
                        <input 
                          required
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parcel ID / APN</label>
                      <input 
                        name="parcelId"
                        value={formData.parcelId}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Abstractor Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                    <User size={18} className="text-purple-600" />
                    <h3>Assign Abstractor</h3>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Abstractor</label>
                    <div className="relative">
                      <select
                        required
                        name="abstractorId"
                        value={formData.abstractorId}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none"
                      >
                        <option value="">Select an abstractor...</option>
                        {MOCK_ABSTRACTORS.map(abs => (
                          <option key={abs.id} value={abs.id}>
                            {abs.name} ({abs.company}) - {abs.rating}★
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Parties */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                    <User size={18} className="text-emerald-600" />
                    <h3>Parties Involved</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seller Name(s)</label>
                      <input 
                        required
                        name="sellerName"
                        value={formData.sellerName}
                        onChange={handleChange}
                        placeholder="Current Owner"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Buyer Name(s)</label>
                      <input 
                        required
                        name="buyerName"
                        value={formData.buyerName}
                        onChange={handleChange}
                        placeholder="Purchaser"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                    <DollarSign size={18} className="text-amber-600" />
                    <h3>Transaction Details</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sales Price</label>
                        <input 
                          type="number"
                          name="salesPrice"
                          value={formData.salesPrice}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Earnest Money</label>
                        <input 
                          type="number"
                          name="earnestMoney"
                          value={formData.earnestMoney}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Closing Date</label>
                      <input 
                        type="date"
                        name="closingDate"
                        value={formData.closingDate}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="order-form"
            disabled={isExtracting}
            className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FileText size={18} />
            Create & Assign Order
          </button>
        </div>
      </motion.div>
    </div>
  );
}
