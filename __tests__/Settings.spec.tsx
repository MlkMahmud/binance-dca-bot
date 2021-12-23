/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import Settings from '../components/Settings';
import { fireEvent, render, screen, waitFor } from '../test-utils';
import { User } from '../types';
import { rest, server } from '../__mocks__/server';

jest.setTimeout(10000);

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdate: (_user: User) => {},
  initialValues: user,
};

describe('Settings', () => {
  it('should render initial data correctly', async () => {
    render(<Settings {...props} />);
    expect(screen.getByRole('form')).toHaveFormValues({
      timezone: user.timezone,
      'slack.url': user.slack.url,
      'slack.enabled': user.slack.enabled,
      'telegram.botToken': user.telegram.botToken,
      'telegram.chatId': user.telegram.chatId,
      'telegram.enabled': user.slack.enabled,
    });
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('should submit successfully', async () => {
    const onUpdate = jest.fn();
    render(<Settings {...props} onUpdate={onUpdate} />);
    const values = {
      slack: { url: 'https://webhook-url.com' },
      telegram: { botToken: 'abdcdef' },
    };
    fireEvent.change(screen.getByRole('textbox', { name: 'slack url' }), {
      target: { value: values.slack.url },
    });
    fireEvent.change(
      screen.getByRole('textbox', { name: 'telegram bot token' }),
      {
        target: { value: values.telegram.botToken },
      }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onUpdate).toHaveBeenCalledWith(values), {
      timeout: 4000,
    });
    expect(screen.getByRole('form')).toHaveFormValues({
      timezone: user.timezone,
      'slack.url': values.slack.url,
      'slack.enabled': user.slack.enabled,
      'telegram.botToken': values.telegram.botToken,
      'telegram.chatId': user.telegram.chatId,
      'telegram.enabled': user.slack.enabled,
    });
  });

  it('should handle submission errors', async () => {
    const onUpdate = jest.fn();
    server.use(
      rest.patch('http://localhost/api/settings/general', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Error' }));
      })
    );
    render(<Settings {...props} onUpdate={onUpdate} />);
    const values = {
      slack: { url: 'https://webhook-url.com' },
      telegram: { botToken: 'abdcdef' },
    };
    fireEvent.change(screen.getByRole('textbox', { name: 'slack url' }), {
      target: { value: values.slack.url },
    });
    fireEvent.change(
      screen.getByRole('textbox', { name: 'telegram bot token' }),
      {
        target: { value: values.telegram.botToken },
      }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onUpdate).toHaveBeenCalledTimes(0), {
      timeout: 4000,
    });
  });
});
