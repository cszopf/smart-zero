'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Copy, Check, Share2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export default function GeminiFileSummary() {
  const { currentOrder, cureItems } = useAppContext();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const generateSummary = useCallback(async () => {
    if (!currentOrder) return;
    
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        You are an expert title insurance assistant. 
        Summarize the following real estate title file in plain English for non-experts (like real estate agents, buyers, or sellers).
        
        Order Details:
        - Order ID: ${currentOrder.orderId}
        - Address: ${currentOrder.propertyAddress}
        - Buyer: ${currentOrder.purchaseContract?.buyerNames.join(', ')}
        - Seller: ${currentOrder.purchaseContract?.sellerNames.join(', ')}
        - Sales Price: $${currentOrder.purchaseContract?.salesPrice.toLocaleString()}
        
        Curative Items (Issues to resolve):
        ${cureItems.filter(i => i.orderId === currentOrder.orderId).map(i => `- ${i.type}: ${i.description} (Status: ${i.status})`).join('\n')}
        
        Goal: Provide a clear, friendly, and professional status update. 
        Explain what is done, what is pending, and if there are any major "deal killers" (be reassuring if things are on track).
        Keep it concise (2-3 short paragraphs).
        Use Markdown formatting.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setSummary(response.text || 'Could not generate summary.');
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Failed to generate AI summary. Please check your connection or API key.');
    } finally {
      setLoading(false);
    }
  }, [currentOrder, cureItems]);

  useEffect(() => {
    if (currentOrder) {
      generateSummary();
    }
  }, [currentOrder, generateSummary]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentOrder) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl shadow-sm mb-8 overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-indigo-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <Sparkles className="text-white" size={20} />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-display font-bold text-slate-900 leading-none">Gemini AI File Summary</h2>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Plain English Status Update
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isOpen && summary && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium italic">
              Click to view AI summary...
            </div>
          )}
          <div className="flex items-center gap-2">
            {isOpen && (
              <button 
                onClick={handleCopy}
                disabled={loading || !summary}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy for Agent'}
              </button>
            )}
            <div className="p-1.5 text-slate-400">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 border-t border-indigo-50 pt-6">
              <div className="relative min-h-[100px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <p className="text-sm italic">Gemini is analyzing the file...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-slate-600">
                    <Markdown>{summary}</Markdown>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      generateSummary();
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    <Loader2 size={12} className={loading ? 'animate-spin' : ''} />
                    Regenerate
                  </button>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Share2 size={10} />
                  <span>Ready to share with external parties</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
