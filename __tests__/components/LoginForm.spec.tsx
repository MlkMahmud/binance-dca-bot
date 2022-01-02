import React from 'react';
import LoginForm from '../../components/LoginForm';
import { rest, server } from '../../__mocks__/server';
import { fireEvent, render, screen, waitFor } from '../../test-utils';

describe('LoginForm', () => {
  it('should render a login form', () => {
    render(<LoginForm onLoginSuccess={() => jest.fn()} />);
    const form = screen.getByRole('form', { name: 'login' });
    expect(form).toBeInTheDocument();
    expect(form).toHaveFormValues({ password: '' });
    expect(screen.getByText(/Login/)).toBeInTheDocument();
  });

  it('should log a user in successfully', async () => {
    const onLoginSuccess = jest.fn();
    render(<LoginForm onLoginSuccess={() => onLoginSuccess()} />);
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: 'supersecretpassword' },
    });
    fireEvent.click(screen.getByText(/Login/));
    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1), {
      timeout: 1500,
    });
  });

  it('should gracefully handle login errors', async () => {
    const onLoginSuccess = jest.fn();
    server.use(
      rest.post('http://localhost/login', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'error' }));
      })
    );
    render(<LoginForm onLoginSuccess={() => onLoginSuccess()} />);
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: 'supersecretpassword' },
    });
    fireEvent.click(screen.getByText(/Login/));
    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(0), {
      timeout: 1500,
    });
  });
});
