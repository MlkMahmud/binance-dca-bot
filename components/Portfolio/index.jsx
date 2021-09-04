import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingState from './LoadingState';

const DefaultState = dynamic(() => import('./DefaultState'), { ssr: false });

export default function Portfolio() {
  const [assets, updateAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('USDT');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      updateAssets([
        { free: 2000, locked: 450, symbol: 'USDT' },
        { free: 5, locked: 2, symbol: 'BNB' },
        { free: 1240, locked: 0, symbol: 'DOGE' },
        { free: 2, locked: 0.5, symbol: 'BTC' },
      ]);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <DefaultState
      assets={assets}
      handleChange={setSelectedSymbol}
      selectedSymbol={selectedSymbol}
    />
  );
}
