export type Fill = {
  commission: string;
  commissionAsset: string;
  price: string;
  qty: string;
  tradeId: number;
};

export type Job = {
  _id: string;
  data: {
    amount: string;
    humanInterval: string;
    jobName: string;
    quoteAsset: string;
    symbol: string;
    useDefaultTimezone: boolean;
    paused?: boolean;
  };
  nextRunAt: Date;
  lastRunAt: Date | null;
  repeatInterval: string;
  repeatTimezone: string;
};

export type Order = {
  cummulativeQuoteQty: string;
  executedQty: string;
  fills: Fill[];
  orderId: number;
  origQty: string;
  status: 'FILLED' | 'PARTIALLY_FILLED';
  symbol: string;
  transactTime: string;
};

export type User = {
  password: { enabled: boolean; isSet: boolean };
  slack: { enabled: boolean; url: string };
  telegram: { enabled: boolean; chatId: string; botToken: string };
  timezone: string;
};
