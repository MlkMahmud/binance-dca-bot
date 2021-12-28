import React from 'react';
import UpdatePasswordForm from '../../components/PasswordSettings/UpdatePasswordForm';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

const props = {
  onUpdate: jest.fn(),
  setIsLoading: jest.fn(),
};

describe('UpdatePasswordForm', () => {
  it('should render the update password form', () => {
    render(<UpdatePasswordForm {...props} />);
    expect(
      screen.getByRole('form', { name: 'update password' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('form', { name: 'update password' })
    ).toHaveFormValues({
      password: '',
      newPassword: '',
    });
  });

  it('should validate form input', () => {
    render(<UpdatePasswordForm {...props} />);
    fireEvent.submit(screen.getByRole('form'));
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('New password is required')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'short' },
    });
    fireEvent.submit(screen.getByRole('form'));
    expect(
      screen.getByText('Password must be at least 8 characters long.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('New password must be at least 8 characters long.')
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'longpassword' },
    });
    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'longpassword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    expect(
      screen.getByText('New password cannot be the same as the old password')
    ).toBeInTheDocument();
  });

  it('should submit successfully', async () => {
    const onUpdate = jest.fn();
    const message = 'password succesfully updated';
    server.use(
      rest.patch('http://localhost/api/settings/password', (_req, res, ctx) => {
        return res(ctx.json({ message }));
      })
    );
    render(<UpdatePasswordForm {...props} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'oldpassword' },
    });
    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'newpassword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(screen.getByText(message)).toBeInTheDocument());
    expect(onUpdate).toHaveBeenCalled();
  });

  it('should handle submission errors', async () => {
    const onUpdate = jest.fn();
    const message = 'faield to update password';
    server.use(
      rest.patch('http://localhost/api/settings/password', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message }));
      })
    );
    render(<UpdatePasswordForm {...props} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'oldpassword' },
    });
    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'newpassword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(screen.getByText(message)).toBeInTheDocument());
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
