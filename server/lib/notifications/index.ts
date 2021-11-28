import slack from './slack';
import telegram from './telegram';
import { Event, JobEventPayload } from '../../../types';

export default {
  async sendMessage(event: Event, job: JobEventPayload) {
    await Promise.all([
      slack.sendMessage(event, job),
      telegram.sendMessage(event, job),
    ]);
  },
};
