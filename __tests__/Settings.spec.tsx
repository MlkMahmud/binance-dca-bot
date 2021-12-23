/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import Settings from '../components/Settings';
import { fireEvent, render, screen } from '../test-utils';
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
  test('should render initial data correctly', async () => {
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

  test('should submit successfully', async () => {
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
    // chakra-ui renders multiple toasts for reason beyond me
    // see https://github.com/chakra-ui/chakra-ui/issues/2969
    const [alert] = await screen.findAllByRole(
      'alert',
      { name: 'Success' },
      { timeout: 4000 }
    );
    expect(alert).toHaveTextContent('Settings updated');
    // for test purposes the endpoint returns the req body
    expect(onUpdate).toHaveBeenCalledWith(values);
  });

  test('should handle submission errors', async () => {
    const onUpdate = jest.fn();
    const errorMessage = 'Failed to updated settings';
    server.use(
      rest.patch('http://localhost/api/settings/general', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: errorMessage }));
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
    const [alert] = await screen.findAllByRole(
      'alert',
      { name: 'Error' },
      { timeout: 4000 }
    );
    expect(alert).toHaveTextContent(errorMessage);
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
