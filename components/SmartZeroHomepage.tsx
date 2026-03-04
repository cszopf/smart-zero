'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { UserRole } from '@/types';
import { Search, Shield, BarChart3, CheckCircle2, FileText, Layers, Database, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function SmartZeroHomepage() {
  const { setRole } = useAppContext();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation / Header */}
      <header className="fixed top-0 w-full bg-slate-50/80 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image 
                src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfTteioSstds6PWnMZuidJMqRYMtVVQGyPt3EexpjhnP9HrRXZ0_3H72SZooXQ3bnlURpX09s5mvrO07fLxO3k7C_8D9mBTm5eXlBqed8jPhaekxSkeuJuBpxwV1BbU1hu3xeG0cYIZkvDvBP-qK4YpkvyOq-g?key=kl0MF71HcvaAWt9zvK_MLQ"
                alt="Smart Zero Logo"
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Smart Zero™</h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Zero Claims. By Design.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <span className="cursor-pointer hover:text-slate-900 transition-colors">Platform</span>
            <span className="cursor-pointer hover:text-slate-900 transition-colors">Solutions</span>
            <span className="cursor-pointer hover:text-slate-900 transition-colors">Enterprise</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <span className="text-slate-900">Sign In</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-32">
            {/* Left Side: Copy */}
            <div className="pt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  Smart Zero™
                </h1>
                <h2 className="text-3xl font-medium text-slate-500 mb-8 tracking-tight">
                  The Zero Claims Title Standard.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                  AI powered search execution. Multi source reconciliation. Human certified validation. 
                  Every file processed under Smart Zero follows a controlled, auditable, defect elimination 
                  protocol designed to reduce title insurance claims to near zero.
                </p>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
                  <Database size={12} className="text-indigo-600" />
                  <span>Standalone Infrastructure. Connected to Smart Database. Posts to Smart Spaces.</span>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Role Cards */}
            <div className="space-y-4">
              <RoleCard 
                icon={<Search className="text-emerald-600" size={24} />}
                title="Abstractor"
                subtitle="Layer 1. Data Capture and Reconciliation."
                description="Upload findings. Reconcile Smart AI search, plant data, recorded documents, and external sources. Confirm chain coverage and flag defects."
                onClick={() => handleRoleSelect('Abstractor')}
                delay={0.1}
              />
              <RoleCard 
                icon={<Shield className="text-indigo-600" size={24} />}
                title="Title Examiner"
                subtitle="Layer 2. Risk Elimination and Exception Control."
                description="Review reconciled packages. Resolve defects. Certify chain integrity. Finalize verified title output."
                onClick={() => handleRoleSelect('Title Examiner')}
                delay={0.2}
              />
              <RoleCard 
                icon={<BarChart3 className="text-purple-600" size={24} />}
                title="Manager"
                subtitle="Layer 3. Risk Governance and Audit Oversight."
                description="Monitor claim risk metrics. Configure verification rules. Enforce Smart Zero standards across all files."
                onClick={() => handleRoleSelect('Manager')}
                delay={0.3}
              />
            </div>
          </div>

          <div className="h-px w-full bg-slate-200 mb-24"></div>

          {/* How Smart Zero Works */}
          <div className="mb-32">
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Four Layer Defense System</h3>
              <p className="text-slate-500">End-to-end verification protocol.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <StepBlock 
                number="01"
                title="AI Search Execution"
                description="Smart Zero runs structured title search across Smart database and connected data sources."
              />
              <StepBlock 
                number="02"
                title="Abstractor Reconciliation"
                description="Human abstractor reconciles AI results with uploaded documents and plant records."
              />
              <StepBlock 
                number="03"
                title="Examiner Certification"
                description="Title examiner validates chain coverage, clears defects, and approves exception list."
              />
              <StepBlock 
                number="04"
                title="Verified Output to Smart Space"
                description="Certified package, risk score, defect log, and audit record are posted directly into the associated Smart Space."
              />
            </div>
          </div>

          {/* Metrics Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-sm mb-32">
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900">Zero Claims Dashboard Preview</h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <MetricTile label="Files Processed Under Smart Zero" value="1,248" />
              <MetricTile label="Defects Identified Pre Closing" value="317" />
              <MetricTile label="Average Risk Score" value="0.12%" highlight />
              <MetricTile label="Verified Chain Coverage Compliance" value="100%" />
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-200 pt-16 pb-8">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Smart Zero™</h4>
                <p className="text-slate-500 text-sm">Infrastructure Layer of the Smart Ecosystem.</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-4 text-sm">Connected Systems</h5>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>Smart Database</li>
                    <li>Smart Spaces</li>
                    <li>Smart Identity</li>
                    <li>Smart Audit Engine</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-900 mb-4 text-sm">Legal</h5>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Compliance</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 border-t border-slate-100 pt-8">
              <p>Every action inside Smart Zero is versioned, timestamped, and attributable. Designed for regulatory defensibility and near zero claim exposure.</p>
              <p className="mt-2">&copy; 2026 Smart Ecosystem. All rights reserved.</p>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}

function RoleCard({ icon, title, subtitle, description, onClick, delay }: { 
  icon: React.ReactNode, 
  title: string, 
  subtitle: string, 
  description: string, 
  onClick: () => void,
  delay: number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
          <div className="w-4 h-4 border-t-2 border-r-2 border-slate-400 rotate-45 transform translate-x-[-2px] translate-y-[1px]"></div>
        </div>
      </div>
      
      <div className="flex items-start gap-6">
        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{subtitle}</p>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function StepBlock({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative pt-6">
      <div className="absolute top-0 left-0 text-4xl font-bold text-slate-100 -z-10">{number}</div>
      <div className="mb-4 w-8 h-px bg-slate-300"></div>
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function MetricTile({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="p-6 first:pl-0 last:pr-0">
      <p className="text-sm font-medium text-slate-500 mb-2">{label}</p>
      <p className={`text-3xl font-bold tracking-tight ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  );
}
