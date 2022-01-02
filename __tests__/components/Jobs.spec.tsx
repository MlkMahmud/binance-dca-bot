import React from 'react';
import Jobs from '../../components/Jobs';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

const props = {
  defaultTimezone: 'Africa/Lagos',
};

describe('Jobs', () => {
  it('should initially render the loading state', async () => {
    render(<Jobs {...props} />);
    expect(screen.getByText('Loading jobs...')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
  });

  it('should render empty state if there are no jobs', async () => {
    server.use(
      rest.get('http://localhost/api/jobs', (_req, res, ctx) => {
        return res(ctx.json({ data: [] }));
      })
    );
    render(<Jobs {...props} />);
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
    expect(screen.getByText('no jobs found')).toBeInTheDocument();
    // should open a form to create a new job
    fireEvent.click(screen.getByText('Add Job'));
    expect(screen.getByText('Create Job')).toBeInTheDocument();
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('form')).toHaveFormValues({
      amount: null,
      jobName: '',
      schedule: '',
      symbol: '',
      timezone: '',
      useDefaultTimezone: false,
    });
  });

  it('should render the error state', async () => {
    server.use(
      rest.get('http://localhost/api/jobs', (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(<Jobs {...props} />);
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
    expect(screen.getByText('Uh oh!')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Try Again/));
    expect(screen.getByText('Loading jobs...')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
  });

  it('should render all jobs', async () => {
    render(<Jobs {...props} />);
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
    expect(screen.getByText(`Jobs(1)`)).toBeInTheDocument();
    expect(screen.getByText('BNB Daily')).toBeInTheDocument();
    expect(screen.getByText('BNBUSDT')).toBeInTheDocument();
    expect(screen.getByText(`400 USDT`)).toBeInTheDocument();
    expect(screen.getByText('At 11:00 PM, every day')).toBeInTheDocument();
    expect(screen.getByText('Africa/Lagos')).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date('2021-12-24T22:00:00.000+00:00').toLocaleString('en-GB')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date('2021-12-25T22:00:00.000+00:00').toLocaleString('en-GB')
      )
    ).toBeInTheDocument();
  });

  it('can delete a job', async () => {
    render(<Jobs {...props} />);
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
    fireEvent.click(screen.getByRole('button', { name: 'delete BNB Daily' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitForElementToBeRemoved(() => screen.getByText('Delete job'));
    expect(screen.getByText(/job deleted/)).toBeInTheDocument();
    expect(screen.getByText('no jobs found')).toBeInTheDocument();
  });

  it('should open the job edit form', async () => {
    render(<Jobs {...props} />);
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
    fireEvent.click(screen.getByRole('button', { name: 'edit BNB Daily' }));
    expect(screen.getByText('Edit your job details')).toBeInTheDocument();
  });

  it('should open order history', async () => {
    render(<Jobs {...props} />);
    await waitForElementToBeRemoved(() => screen.getByText('Loading jobs...'));
    fireEvent.click(
      screen.getByRole('button', { name: 'view BNB Daily history' })
    );
    expect(screen.getByText('Order history')).toBeInTheDocument();
  });
});
