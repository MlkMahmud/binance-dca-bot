/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import Settings from '.';
import { render } from '../../test-utils';
import { User } from '../../types';

const user = {
  password: { enabled: false, isSet: false },
  slack: { enabled: true, url: 'http:/slack-hook.com' },
  telegram: {
    botToken: 'bot2345538:ZcsgfdZz-H8Z0iqG7PNE06W3qPZd0Dm6DB0k',
    chatId: '-618305579',
    enabled: true,
  },
  timezone: 'Africa/Lagos',
};

const props = {
  isOpen: true,
  onClose: () => {},
  onUpdate: (_user: User) => {},
  initialValues: user,
};

describe('Settings', () => {
  test('should render initial data correctly', async () => {
    const { getByRole } = render(<Settings {...props} />);
    expect(getByRole('form')).toHaveFormValues({
      timezone: user.timezone,
      'slack.url': user.slack.url,
      'slack.enabled': user.slack.enabled,
      'telegram.botToken': user.telegram.botToken,
      'telegram.chatId': user.telegram.chatId,
      'telegram.enabled': user.slack.enabled,
    });
    expect(getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
