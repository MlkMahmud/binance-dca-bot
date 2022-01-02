import React from 'react';
import PasswordSettings from '../../components/PasswordSettings';
import { fireEvent, render, screen } from '../../test-utils';

const props = {
  isOpen: true,
  onClose: jest.fn(),
  onUpdate: jest.fn(),
  user: {
    password: { enabled: false, isSet: false },
    slack: { enabled: true, url: 'http:/slack-hook.com' },
    telegram: {
      botToken: 'bot2345538:ZcsgfdZz-H8Z0iqG7PNE06W3qPZd0Dm6DB0k',
      chatId: '-618305579',
      enabled: true,
    },
    timezone: 'Africa/Lagos',
  },
};

describe('PasswordSettings', () => {
  it('should render the enable password action', () => {
    render(<PasswordSettings {...props} />);
    expect(screen.getByText('Security settings')).toBeInTheDocument();
    expect(screen.getByText('Enable password')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('should render the enable password form', () => {
    render(<PasswordSettings {...props} />);
    fireEvent.click(screen.getByText('Enable password'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      screen.getByRole('form', { name: 'enable password' })
    ).toBeInTheDocument();
  });

  it('should render the disable and update password action', () => {
    const user = { ...props.user, password: { enabled: true, isSet: true } };
    render(<PasswordSettings {...props} user={user} />);
    expect(screen.getByText('Disable password')).toBeInTheDocument();
    expect(screen.getByText('Update password')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('should render the disable password form', () => {
    const user = { ...props.user, password: { enabled: true, isSet: true } };
    render(<PasswordSettings {...props} user={user} />);
    fireEvent.click(screen.getByText('Disable password'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      screen.getByRole('form', { name: 'disable password' })
    ).toBeInTheDocument();
  });

  it('should render the update password form', () => {
    const user = { ...props.user, password: { enabled: true, isSet: true } };
    render(<PasswordSettings {...props} user={user} />);
    fireEvent.click(screen.getByText('Update password'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      screen.getByRole('form', { name: 'update password' })
    ).toBeInTheDocument();
  });
});
