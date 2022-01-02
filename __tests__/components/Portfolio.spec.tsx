import React from 'react';
import Portfolio from '../../components/Portfolio';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

describe('Porfolio', () => {
  it('should render the error state', async () => {
    server.use(
      rest.get('http://localhost/api/balance', (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(<Portfolio />);
    await waitFor(() => expect(screen.getByText(/Uh oh!/)).toBeInTheDocument());
    expect(
      screen.getByRole('button', { name: /Try again/ })
    ).toBeInTheDocument();
  });

  it('should display all portfolio assets', async () => {
    render(<Portfolio />);
    await waitFor(() => expect(screen.getByText(/Asset/)).toBeInTheDocument());
    expect(screen.getByRole('combobox', { name: 'assets' })).toHaveValue(
      'USDT'
    );
    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(screen.getByRole('option', { name: 'ETH' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'BTC' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'BNB' })).toBeInTheDocument();
    expect(screen.getByText(/Free/)).toBeInTheDocument();
    expect(screen.getByText('5000.00 USDT')).toBeInTheDocument();
    expect(screen.getByText(/Locked/)).toBeInTheDocument();
    expect(screen.getByText('250.00 USDT')).toBeInTheDocument();
    expect(screen.getByText(/Total/)).toBeInTheDocument();
    expect(screen.getByText('5250.00 USDT')).toBeInTheDocument();
  });

  it('should toggle portfolio visibility', async () => {
    render(<Portfolio />);
    await waitFor(() => expect(screen.getByText(/Asset/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'hide balance' }));
    expect(screen.getAllByText('***')).toHaveLength(3);
    expect(screen.queryByText('5000.00 USDT')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'show balance' }));
    expect(screen.getByText('5000.00 USDT')).toBeInTheDocument();
  });

  it('should refesh portfolio balance', async () => {
    render(<Portfolio />);
    await waitFor(() => expect(screen.getByText(/Asset/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'refresh portfolio' }));
    expect(screen.queryByText(/Free/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Locked/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Total/)).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Asset/)).toBeInTheDocument());
    expect(screen.queryByText(/Free/)).toBeInTheDocument();
    expect(screen.queryByText(/Locked/)).toBeInTheDocument();
    expect(screen.queryByText(/Total/)).toBeInTheDocument();
  });

  it('defaults to a 0 USDT balance if portfolio is empty', async () => {
    server.use(
      rest.get('http://localhost/api/balance', (_req, res, ctx) => {
        return res(ctx.json({ data: [] }));
      })
    );
    render(<Portfolio />);
    await waitFor(() => expect(screen.getByText(/Asset/)).toBeInTheDocument());
    expect(screen.getByRole('combobox', { name: 'assets' })).toHaveValue(
      'USDT'
    );
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });
});
