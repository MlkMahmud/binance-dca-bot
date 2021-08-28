import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('./Loading'), { ssr: false });
const Portfolio = dynamic(() => import('./Portfolio'), { ssr: false });

export default function Component() {
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
    return <Loading />;
  }

  return (
    <Portfolio
      assets={assets}
      handleChange={setSelectedSymbol}
      selectedSymbol={selectedSymbol}
    />
  );
}
