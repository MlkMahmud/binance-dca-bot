/* eslint-env browser */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PortfolioLoadingState from './PortfolioLoadingState';

const PortfolioDefaultState = dynamic(() => import('./PortfolioDefaultState'), { loading: () => <PortfolioLoadingState /> });
const PortfolioErrorState = dynamic(() => import('./PortfolioErrorState'), { loading: () => <PortfolioLoadingState /> });

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
    return <PortfolioLoadingState />;
  }

  if (error) {
    return <PortfolioErrorState onClick={() => fetchAssets()} />;
  }

  return (
    <PortfolioDefaultState
      assets={assets}
      onChange={setSelectedSymbol}
      onRefresh={fetchAssets}
      selectedSymbol={selectedSymbol}
    />
  );
}
