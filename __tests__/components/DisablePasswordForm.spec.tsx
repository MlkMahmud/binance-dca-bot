import React from 'react';
import DisablePasswordForm from '../../components/PasswordSettings/DisablePasswordForm';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

const props = {
  onUpdate: jest.fn(),
  setIsLoading: jest.fn(),
};

describe('DisablePasswordForm', () => {
  it('should render the password disable form', () => {
    render(<DisablePasswordForm {...props} />);
    expect(
      screen.getByRole('form', { name: 'disable password' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/)).toBeInTheDocument();
    expect(screen.getByRole('form')).toHaveFormValues({ password: '' });
  });

  it('should validate password input field', () => {
    render(<DisablePasswordForm {...props} />);
    fireEvent.submit(screen.getByRole('form'));
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Password:/), {
      target: { value: 'short' },
    });
    fireEvent.submit(screen.getByRole('form'));
    expect(
      screen.getByText('Password must be at least 8 characters long.')
    ).toBeInTheDocument();
  });

  it('should submit successfully', async () => {
    const onUpdate = jest.fn();
    const message = 'password succesfully disabled';
    server.use(
      rest.patch('http://localhost/api/settings/password', (_req, res, ctx) => {
        return res(ctx.json({ message }));
      })
    );
    render(<DisablePasswordForm {...props} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByLabelText(/Password:/), {
      target: { value: 'longpassword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(screen.getByText(message)).toBeInTheDocument());
    expect(onUpdate).toHaveBeenCalled();
  });

  it('should handle submission errors', async () => {
    const onUpdate = jest.fn();
    const message = 'Failed to disable password';
    server.use(
      rest.patch('http://localhost/api/settings/password', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message }));
      })
    );
    render(<DisablePasswordForm {...props} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByLabelText(/Password:/), {
      target: { value: 'longpassword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(screen.getByText(message)).toBeInTheDocument());
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
