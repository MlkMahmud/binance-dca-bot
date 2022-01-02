import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PortfolioLoadingState from './PortfolioLoadingState';
import Loading from '../Loading';

type Assets = Array<{
  asset: string;
  free: string;
  locked: string;
  total: number;
}>;

const PortfolioDefaultState = dynamic(() => import('./PortfolioDefaultState'), {
  loading: ({ error }) => {
    if (error) {
      return <Loading error={error} />;
    }
    return <PortfolioLoadingState />;
  },
});
const PortfolioErrorState = dynamic(() => import('./PortfolioErrorState'), {
  loading: ({ error }) => {
    if (error) {
      return <Loading error={error} />;
    }
    return <PortfolioLoadingState />;
  },
});

export default function Portfolio() {
  const [assets, updateAssets] = useState<Assets>([
    { asset: 'USDT', free: '0.00', locked: '0.00', total: 0.0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('USDT');
  const [error, setError] = useState(false);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/balance');
      if (response.ok) {
        const { data: balances } = await response.json();
        if (balances.length > 0) {
          updateAssets(balances);
        }
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
