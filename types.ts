export type JobConfig = {
  amount: string;
  jobName: string;
  schedule: string;
  quoteAsset: string;
  symbol: string;
  timezone: string;
  useDefaultTimezone: boolean;
};

export type Event = 'success' | 'error';

export type JobEventPayload = Partial<{
  name: string;
  status: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  nextRunAt: string | null;
  transactTime: string;
  date: string;
  reason: string;
}>;