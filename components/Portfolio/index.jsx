/* eslint-env browser */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingState from './LoadingState';

const DefaultState = dynamic(() => import('./DefaultState'), { loading: () => <LoadingState /> });
const ErrorState = dynamic(() => import('./ErrorState'), { loading: () => <LoadingState /> });

export default function Portfolio() {
  const [assets, updateAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('USDT');
  const [error, setError] = useState(false);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/balance');
      if (response.ok) {
        const balances = await response.json();
        updateAssets(balances);
        setIsLoading(false);
        setError(false);
      } else {
        throw new Error(response.statusText);
      }
    } catch (e) {
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState handleClick={() => fetchAssets()} />;
  }

  return (
    <DefaultState
      assets={assets}
      onChange={setSelectedSymbol}
      onRefresh={fetchAssets}
      selectedSymbol={selectedSymbol}
    />
  );
}
