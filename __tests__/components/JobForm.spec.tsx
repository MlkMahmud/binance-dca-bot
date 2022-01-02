import React from 'react';
import JobForm from '../../components/JobForm';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../../test-utils';
import { rest, server } from '../../__mocks__/server';

jest.setTimeout(20000);

const newValues = {
  amount: '600',
  jobName: 'BNBUSDT MAX',
};

const props = {
  defaultTimezone: 'Africa/Lagos',
  isOpen: true,
  job: {
    _id: '61b10730ab9b1e8a9b1578ce',
    data: {
      amount: '400',
      humanInterval: 'At 11:00 PM, every day',
      jobName: 'BNB Daily',
      quoteAsset: 'USDT',
      symbol: 'BNBUSDT',
      useDefaultTimezone: false,
    },
    disabled: true,
    nextRunAt: new Date('2021-12-24T22:00:00.000+00:00'),
    lastRunAt: new Date('2021-12-24T22:00:00.000+00:00'),
    repeatInterval: '0 23 * * *',
    repeatTimezone: 'Africa/Lagos',
  },
  onFormClose: jest.fn(),
  onSubmitSuccess: jest.fn(),
};

describe('JobForm', () => {
  it('should render an empty form', () => {
    render(<JobForm {...props} job={null} />);
    const form = screen.getByRole('form');
    expect(screen.getByText(/Create a new recurring job/)).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(form).toHaveFormValues({
      amount: null,
      jobName: '',
      schedule: '',
      symbol: '',
      timezone: '',
      useDefaultTimezone: false,
    });
  });

  it('should hide the "use default timezone switch"', () => {
    render(<JobForm {...props} defaultTimezone="" />);
    expect(screen.queryByText(/Use default timezone/)).not.toBeInTheDocument();
  });

  it('should render a prefilled form', () => {
    render(<JobForm {...props} />);
    const form = screen.getByRole('form');
    expect(screen.getByText(/Edit your job details/)).toBeInTheDocument();
    expect(form).toHaveFormValues({
      amount: Number(props.job.data.amount),
      jobName: props.job.data.jobName,
      schedule: props.job.repeatInterval,
      timezone: props.job.repeatTimezone,
      useDefaultTimezone: false,
    });
  });

  it('should submit successfully', async () => {
    const onSubmitSuccess = jest.fn();
    render(<JobForm {...props} onSubmitSuccess={onSubmitSuccess} />);
    fireEvent.change(screen.getByDisplayValue(props.job.data.amount), {
      target: { value: Number(newValues.amount) },
    });
    fireEvent.change(screen.getByDisplayValue(props.job.data.jobName), {
      target: { value: newValues.jobName },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(
      () =>
        expect(
          screen.getByText(/Job updated successfully/)
        ).toBeInTheDocument(),
      { timeout: 12000 }
    );
    expect(onSubmitSuccess).toHaveBeenCalledWith(newValues, 'update');
  });

  it('should validate input fields', () => {
    const onSubmitSuccess = jest.fn();
    render(<JobForm {...props} onSubmitSuccess={onSubmitSuccess} />);
    fireEvent.change(screen.getByDisplayValue(props.job.data.amount), {
      target: { value: null },
    });
    fireEvent.change(screen.getByDisplayValue(props.job.data.jobName), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText(/Job name is required/)).toBeInTheDocument();
    expect(
      screen.getByText(/Please provide a valid amount/)
    ).toBeInTheDocument();
  });

  it('should handle submission errors', async () => {
    const onSubmitSuccess = jest.fn();
    const errorMessage = 'Uh oh. Something went wrong';
    server.use(
      rest.patch('http://localhost/api/jobs/:jobId', (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: errorMessage }));
      })
    );
    render(<JobForm {...props} onSubmitSuccess={onSubmitSuccess} />);
    fireEvent.change(screen.getByDisplayValue(props.job.data.amount), {
      target: { value: Number(newValues.amount) },
    });
    fireEvent.change(screen.getByDisplayValue(props.job.data.jobName), {
      target: { value: newValues.jobName },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../), {
      timeout: 12000,
    });
    expect(onSubmitSuccess).toHaveBeenCalledTimes(0);
  });
});
