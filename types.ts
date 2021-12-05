export type Job = {
  _id: string;
  data: {
    amount: string;
    jobName: string;
    quoteAsset: string;
    symbol: string;
    useDefaultTimezone: boolean;
  };
  repeatInterval: string;
  repeatTimezone: string;
}

export type User = {
  password: { enabled: boolean; isSet: boolean };
  slack: { enabled: boolean; url: string },
  telegram: { enabled: boolean; chatId: string; botToken: string; };
  timezone: string;
};