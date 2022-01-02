import React from 'react';
import Settings from '../../components/Settings';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

jest.setTimeout(20000);

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

const values = {
  slack: { url: 'https://webhook-url.com' },
  telegram: { botToken: 'abdcdef' },
};

const props = {
  isOpen: true,
  onClose: jest.fn(),
  onUpdate: jest.fn(),
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
  });

  it('should submit successfully', async () => {
    const onUpdate = jest.fn();
    render(<Settings {...props} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByDisplayValue(user.slack.url), {
      target: { value: values.slack.url },
    });
    fireEvent.change(screen.getByDisplayValue(user.telegram.botToken), {
      target: { value: values.telegram.botToken },
    });
    fireEvent.click(screen.getByText(/Save/));
    await waitFor(
      () => expect(screen.getByText(/Settings updated/)).toBeInTheDocument(),
      {
        timeout: 8000,
      }
    );
    expect(onUpdate).toHaveBeenCalledWith(values);
  });

  it('should handle submission errors', async () => {
    const onUpdate = jest.fn();
    server.use(
      rest.patch('http://localhost/api/settings/general', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Error' }));
      })
    );
    render(<Settings {...props} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByDisplayValue(user.slack.url), {
      target: { value: values.slack.url },
    });
    fireEvent.change(screen.getByDisplayValue(user.telegram.botToken), {
      target: { value: values.telegram.botToken },
    });
    fireEvent.click(screen.getByText(/Save/));
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../), {
      timeout: 8000,
    });
    expect(onUpdate).toHaveBeenCalledTimes(0);
  });
});
