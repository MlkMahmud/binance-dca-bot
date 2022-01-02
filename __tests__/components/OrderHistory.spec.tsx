import React from 'react';
import OrderHistory from '../../components/OrderHistory';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

const props = {
  isOpen: true,
  jobId: '61b10730ab9b1e8a9b1578ce',
  jobName: 'BNB Daily',
  onClose: jest.fn(),
};

const sampleOrder = {
  cummulativeQuoteQty: '42.18000000',
  executedQty: '0.06000000',
  fills: [
    {
      commission: '0.00000000',
      commissionAsset: 'BNB',
      price: '703.0000000',
      qty: '0.06000000',
      tradeId: 123148,
    },
  ],
  orderId: 3122695,
  origQty: '0.06000000',
  status: 'FILLED',
  symbol: 'BNBUSDT',
  transactTime: '2021-11-13T22:15:00.960+00:00',
};

describe('OrderHistory', () => {
  it('should initially render the loading state', async () => {
    render(<OrderHistory {...props} />);
    expect(screen.getByText(props.jobName)).toBeInTheDocument();
    expect(screen.queryByText('Loading orders...')).toBeInTheDocument();
    await waitForElementToBeRemoved(
      () => screen.queryByText('Loading orders...'),
      { timeout: 1500 }
    );
  });

  it('should render an empty state when there are no orders', async () => {
    render(<OrderHistory {...props} />);
    await waitForElementToBeRemoved(
      () => screen.getByText('Loading orders...'),
      { timeout: 1500 }
    );
    expect(
      screen.getByText('There are currenlty no orders for this job.')
    ).toBeInTheDocument();
  });

  it('should render error state', async () => {
    server.use(
      rest.get('http://localhost/api/jobs/:jobId/orders', (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(<OrderHistory {...props} />);
    await waitForElementToBeRemoved(
      () => screen.getByText('Loading orders...'),
      { timeout: 1500 }
    );
    expect(
      screen.queryByText('Failed to fetch orders for this job.')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Try Again./));
    expect(
      screen.queryByText('Failed to fetch orders for this job.')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Loading orders...')).toBeInTheDocument();
    await waitForElementToBeRemoved(() =>
      screen.getByText('Loading orders...')
    );
  });

  it('should render all job orders', async () => {
    server.use(
      rest.get('http://localhost/api/jobs/:jobId/orders', (_req, res, ctx) => {
        return res(ctx.json({ data: [sampleOrder] }));
      })
    );
    render(<OrderHistory {...props} />);
    await waitForElementToBeRemoved(
      () => screen.getByText('Loading orders...'),
      { timeout: 1500 }
    );
    expect(screen.getByText(sampleOrder.symbol)).toBeInTheDocument();
    expect(screen.getByText(/Updated At/)).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date('2021-11-13T22:15:00.960+00:00').toLocaleString('en-GB')
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Order Id/)).toBeInTheDocument();
    expect(screen.getByText(sampleOrder.orderId)).toBeInTheDocument();
    expect(screen.getByText(/Status/)).toBeInTheDocument();
    expect(screen.getByText(sampleOrder.status)).toBeInTheDocument();
    expect(screen.getByText(/Amount/)).toBeInTheDocument();
    expect(
      screen.getByText(sampleOrder.cummulativeQuoteQty)
    ).toBeInTheDocument();
    expect(screen.getByText(/Original Qty/)).toBeInTheDocument();
    expect(screen.getByText(/Executed Qty/)).toBeInTheDocument();
    // The origQty, executedQty and fill[0] Qty are all the same.
    expect(screen.getAllByText(sampleOrder.executedQty)).toHaveLength(3);
    expect(screen.getByText('trades')).toBeInTheDocument();
    expect(screen.getAllByText('commission')).toHaveLength(
      sampleOrder.fills.length
    );
    expect(screen.getAllByText('0.00000000 BNB')).toHaveLength(
      sampleOrder.fills.length
    );
    expect(screen.getByText(sampleOrder.fills[0].price)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'show order fills' })
    ).toBeInTheDocument();
  });
});
