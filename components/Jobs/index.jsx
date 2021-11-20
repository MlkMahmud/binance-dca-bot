import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import LoadingState from './LoadingState';

const EmptyState = dynamic(() => import('./EmptyState'), { loading: () => <LoadingState /> });
const JobList = dynamic(() => import('./JobList'), { loading: () => <LoadingState /> });

export default function Jobs({ defaultTimezone }) {
  const [isLoading, setIsloading] = useState(true);
  const [jobs, updateJobs] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateJobs([
        {
          name: 'BNB Daily',
          symbol: 'BNBUSDT',
          amount: '50 USDT',
          schedule: '0 0/5 * 1/1 * ?',
          lastRun: '2021-11-16T21:11:42.744+00:00',
          nextRun: '2021-11-16T21:15:00.000+00:00',
          timezone: 'Europe/London',
          disabled: true,
        },
        {
          name: 'BTC Weekly',
          symbol: 'BTCUSDT',
          amount: '100 USDT',
          schedule: '0 0/5 * 1/1 * ?',
          lastRun: '2021-11-16T21:11:42.744+00:00',
          nextRun: '2021-11-16T21:15:00.000+00:00',
          timezone: 'Africa/Lagos',
          disabled: false,
        },
        {
          name: 'BNB Daily',
          symbol: 'BNBUSDT',
          amount: '50 USDT',
          schedule: '0 0/5 * 1/1 * ?',
          lastRun: '2021-11-16T21:11:42.744+00:00',
          nextRun: '2021-11-16T21:15:00.000+00:00',
          timezone: 'Europe/London',
          disabled: true,
        },
        {
          name: 'BTC Weekly',
          symbol: 'BTCUSDT',
          amount: '100 USDT',
          schedule: '0 0/5 * 1/1 * ?',
          lastRun: '2021-11-16T21:11:42.744+00:00',
          nextRun: '2021-11-16T21:15:00.000+00:00',
          timezone: 'Africa/Lagos',
          disabled: false,
        },
        {
          name: 'BNB Daily',
          symbol: 'BNBUSDT',
          amount: '50 USDT',
          schedule: '0 0/5 * 1/1 * ?',
          lastRun: '2021-11-16T21:11:42.744+00:00',
          nextRun: '2021-11-16T21:15:00.000+00:00',
          timezone: 'Europe/London',
          disabled: true,
        },
        {
          name: 'BTC Weekly',
          symbol: 'BTCUSDT',
          amount: '100 USDT',
          schedule: '0 0/5 * 1/1 * ?',
          lastRun: '2021-11-16T21:11:42.744+00:00',
          nextRun: '2021-11-16T21:15:00.000+00:00',
          timezone: 'Africa/Lagos',
          disabled: false,
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

  return <JobList defaultTimezone={defaultTimezone} jobs={jobs} />;
}

Jobs.propTypes = {
  defaultTimezone: PropTypes.string.isRequired,
};
