'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import SmartZeroHomepage from '@/components/SmartZeroHomepage';
import AbstractorQueue from '@/components/AbstractorQueue';
import OrderOverview from '@/components/OrderOverview';
import ReconciliationDashboard from '@/components/ReconciliationDashboard';
import UploadFindings from '@/components/UploadFindings';
import SubmissionSummary from '@/components/SubmissionSummary';
import ExaminerReview from '@/components/ExaminerReview';
import ManagerDashboard from '@/components/ManagerDashboard';

export default function Page() {
  const { role, currentOrder } = useAppContext();
  const [view, setView] = React.useState<'overview' | 'work'>('overview');

  // Reset view when order changes
  React.useEffect(() => {
    if (currentOrder) {
      setView('overview');
    }
  }, [currentOrder]);

  if (!role) {
    return <SmartZeroHomepage />;
  }

  const renderContent = () => {
    if (role === 'Abstractor') {
      if (!currentOrder) {
        return <AbstractorQueue />;
      }
      
      // Always show Overview first unless user explicitly enters work mode
      if (view === 'overview') {
        return <OrderOverview onStartWork={() => setView('work')} />;
      }

      switch (currentOrder.status) {
        case 'Abstractor Upload Needed':
          return <UploadFindings onBack={() => setView('overview')} />;
        case 'Reconciliation In Progress':
          return <ReconciliationDashboard onBack={() => setView('overview')} />;
        case 'Submitted For Examiner Review':
          return <SubmissionSummary />;
        default:
          return <OrderOverview onStartWork={() => setView('work')} />;
      }
    }

    if (role === 'Title Examiner') {
      return <ExaminerReview />;
    }

    if (role === 'Manager') {
      return <ManagerDashboard />;
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
}
