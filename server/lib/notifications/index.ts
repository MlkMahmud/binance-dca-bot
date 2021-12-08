import slack from './slack';
import telegram from './telegram';


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


export default {
  async sendMessage(event: Event, job: JobEventPayload) {
    await Promise.all([
      slack.sendMessage(event, job),
      telegram.sendMessage(event, job),
    ]);
  },
};
