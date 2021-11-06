import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingState from './LoadingState';

const EmptyState = dynamic(() => import('./EmptyState'), { loading: () => <LoadingState /> });
const JobList = dynamic(() => import('./JobList'), { loading: () => <LoadingState /> });

export default function Jobs() {
  const [isLoading, setIsloading] = useState(true);
  const [jobs, updateJobs] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateJobs([
        {
          baseAsset: 'BTC',
          id: '1',
          interval: 'daily',
          isActive: true,
          name: 'Btc-Usdt Daily',
          quoteAsset: 'USDT',
        },
        {
          baseAsset: 'BNB',
          id: '2',
          interval: 'monthly',
          isActive: true,
          name: 'BNB/USDT Monthly',
          quoteAsset: 'USDT',
        },
        {
          baseAsset: 'DOGE',
          id: '3',
          interval: 'weekly',
          isActive: false,
          name: 'DOGE BUY',
          quoteAsset: 'USDT',
        },
      ]);
      setIsloading(false);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (jobs.length < 1) {
    return <EmptyState />;
  }

  return <JobList jobs={jobs} />;
}
