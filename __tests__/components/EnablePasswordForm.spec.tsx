import React from 'react';
import EnablePasswordForm from '../../components/PasswordSettings/EnablePasswordForm';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

const props = {
  hasSetPassword: true,
  onUpdate: jest.fn(),
  setIsLoading: jest.fn(),
};

describe('EnablePasswordForm', () => {
  it('should render a single password field', () => {
    render(<EnablePasswordForm {...props} />);
    expect(
      screen.getByRole('form', { name: 'enable password' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/)).toBeInTheDocument();
  });

  it('should render a two password fields', () => {
    render(<EnablePasswordForm {...props} hasSetPassword={false} />);
    expect(
      screen.getByRole('form', { name: 'enable password' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('New password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password:')).toBeInTheDocument();
  });

  it('should ensure new password and confirm password match', () => {
    render(<EnablePasswordForm {...props} hasSetPassword={false} />);
    fireEvent.change(screen.getByLabelText('New password:'), {
      target: { value: 'supersecretpassword' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password:'), {
      target: { value: 'differentpasword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    expect(
      screen.getByText('Confirm password must match password field')
    ).toBeInTheDocument();
  });

  it('should ensure the password is at least 8 chars long', () => {
    render(<EnablePasswordForm {...props} />);
    fireEvent.change(screen.getByLabelText(/Password:/), {
      target: { value: 'supe' },
    });
    fireEvent.submit(screen.getByRole('form'));
    expect(
      screen.getByText('Password must be at least 8 characters long.')
    ).toBeInTheDocument();
  });

  it('should submit successfully', async () => {
    const onUpdate = jest.fn();
    const message = 'password succesfully enabled';
    server.use(
      rest.post('http://localhost/api/settings/password', (_req, res, ctx) => {
        return res(ctx.json({ message }));
      })
    );
    render(
      <EnablePasswordForm
        {...props}
        hasSetPassword={false}
        onUpdate={onUpdate}
      />
    );
    fireEvent.change(screen.getByLabelText('New password:'), {
      target: { value: 'supersecretpassword' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password:'), {
      target: { value: 'supersecretpassword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(screen.getByText(message)).toBeInTheDocument());
    expect(onUpdate).toHaveBeenCalled();
  });

  it('should handle submission errors', async () => {
    const onUpdate = jest.fn();
    const message = 'failed to enable password';
    server.use(
      rest.post('http://localhost/api/settings/password', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message }));
      })
    );
    render(
      <EnablePasswordForm
        {...props}
        hasSetPassword={false}
        onUpdate={onUpdate}
      />
    );
    fireEvent.change(screen.getByLabelText('New password:'), {
      target: { value: 'supersecretpassword' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password:'), {
      target: { value: 'supersecretpassword' },
    });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(screen.getByText(message)).toBeInTheDocument());
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
