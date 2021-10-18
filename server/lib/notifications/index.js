import slack from './slack';
import telegram from './telegram';

export default {
  async sendMessage(event, job) {
    await Promise.all([
      slack.sendMessage(event, job),
      telegram.sendMessage(event, job),
    ]);
  },
};
