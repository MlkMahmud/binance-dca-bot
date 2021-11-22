/* eslint-env browser */
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue';
import { diff } from 'deep-object-diff';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import {
  displayToast,
  generateSelectOption,
  getSymbols,
  getTimezones,
} from '../utils';
import Overlay from './Overlay';
import Popover from './Popover';
import Select from './Select';

export default function JobForm({
  onFormClose,
  isOpen,
  job,
  defaultTimezone,
}) {
  const isEditMode = !!job;
  const initialValues = isEditMode ? {
    amount: job.data.amount,
    name: job.data.jobName,
    quoteAsset: job.data.quoteAsset,
    schedule: job.repeatInterval,
    symbol: job.data.symbol,
    timezone: job.repeatTimezone,
    useDefaultTimezone: job.data.useDefaultTimezone,
  } : {
    useDefaultTimezone: false,
  };
  const subTitle = isEditMode ? 'Edit your job details' : 'Create a new recurring job';
  const title = isEditMode ? 'Edit Job' : 'Create Job';
  const [isLoading, setIsLoading] = useState(false);
  const [minNotional, setMinNotional] = useState(0);
  const [cronTime, setCronTime] = useState('');
  const btnRef = useRef();

  const loadSymbols = useCallback(debounce((input, cb) => {
    getSymbols(input).then((symbols) => cb(symbols));
  }, 700), []);

  const loadTimezones = useCallback(debounce((input, cb) => {
    getTimezones(input).then((timezones) => cb(timezones));
  }, 700), []);

  function validate(values) {
    const errors = {};
    if (!values.name) {
      errors.name = 'Job name is required';
    }

    if (!values.symbol) {
      errors.symbol = 'Please select a valid symbol';
    }

    if (!values.amount || Number.isNaN(+values.amount)) {
      errors.amount = 'Please provide a valid amount';
    } else if (+values.amount < minNotional) {
      errors.amount = `Amount must be greater than or eqaul to ${minNotional}`;
    }

    if (!values.schedule) {
      errors.schedule = 'Please provide a valid schedule';
    } else {
      try {
        parseExpression(values.schedule);
        setCronTime(cronstrue.toString(values.schedule, { verbose: true }));
      } catch {
        errors.schedule = 'Invalid cron syntax';
      }
    }

    if (!values.timezone && !values.useDefaultTimezone) {
      errors.timezone = 'Please provide a valid timezone';
    }
    return errors;
  }

  // eslint-disable-next-line consistent-return
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (isEditMode) {
        const response = await fetch(`/api/symbols?q=${values.symbol}`);
        const [symbol] = await response.json();
        if (symbol.minNotional > +values.amount) {
          setIsLoading(false);
          return { amount: `Amount must be greater than or eqaul to ${symbol.minNotional}` };
        }
      }
      // eslint-disable-next-line no-underscore-dangle
      const url = isEditMode ? `/api/jobs/${job._id}` : '/api/jobs';
      const method = isEditMode ? 'PATCH' : 'POST';
      const payload = isEditMode ? diff(initialValues, values) : values;
      const response = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        displayToast({
          description: 'Job created successfully',
          status: 'success',
          title: 'Success',
        });
      } else { throw new Error(response.statusText); }
    } catch {
      setIsLoading(false);
      displayToast({
        description: 'Failed to create job',
        title: 'Error',
      });
    }
  };

  return (
    <Overlay
      formId="job"
      onClose={() => {
        if (!isLoading) {
          onFormClose();
        }
      }}
      isLoading={isLoading}
      isOpen={isOpen}
      ref={btnRef}
      subTitle={subTitle}
      title={title}
    >
      <Form
        initialValues={initialValues}
        mutators={{
          updateSymbol([value], state, { changeValue }) {
            changeValue(state, 'symbol', () => value);
          },
          updateQuoteAsset([value], state, { changeValue }) {
            changeValue(state, 'quoteAsset', () => value);
          },
          updateTimezone([value], state, { changeValue }) {
            changeValue(state, 'timezone', () => value);
          },
          updateUseDefaultTimezone([value], state, { changeValue }) {
            changeValue(state, 'useDefaultTimezone', () => value);
          },
        }}
        onSubmit={onSubmit}
        // eslint-disable-next-line react/jsx-no-bind
        validate={validate}
      >
        {({
          form,
          handleSubmit,
          pristine,
          values,
        }) => {
          if (btnRef.current) {
            if (pristine) {
              btnRef.current.disabled = true;
            } else {
              btnRef.current.disabled = false;
            }
          }
          return (
            <form id="job" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Field name="name">
                  {({ input, meta }) => (
                    <FormControl id="name" isInvalid={meta.error && meta.touched}>
                      <FormLabel mb="1px">
                        <Stack align="center" isInline spacing={1}>
                          <Text fontSize="17px" fontWeight="bold">
                            Name
                          </Text>
                          <Popover title="Job name">
                            A discernible name for your recurring job.
                          </Popover>
                        </Stack>
                      </FormLabel>
                      <Input
                        name={input.name}
                        onBlur={input.onBlur}
                        onChange={input.onChange}
                        value={input.value}
                        placeholder="BNB Daily"
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="symbol">
                  {({ meta }) => (
                    <FormControl id="symbol" isInvalid={meta.error && meta.touched}>
                      <FormLabel mb="1px">
                        <Stack align="center" isInline spacing={1}>
                          <Text fontSize="17px" fontWeight="bold">
                            Symbol
                          </Text>
                          <Popover title="Symbol">
                            This is the base asset and quote asset pair you want to trade
                            {' '}
                            e.g BTCUSDT
                          </Popover>
                        </Stack>
                      </FormLabel>
                      <Select
                        isAsync
                        loadOptions={loadSymbols}
                        getOptionLabel={(option) => option.symbol}
                        getOptionValue={(option) => option.symbol}
                        onChange={(option) => {
                          form.mutators.updateSymbol(option.symbol);
                          form.mutators.updateQuoteAsset(option.quoteAsset);
                          setMinNotional(option.minNotional);
                        }}
                        placeholder="BNBUSDT"
                        value={{ symbol: values.symbol }}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field
                  name="amount"
                >
                  {({ input, meta }) => {
                    const isInvalid = (meta.touched && meta.error) || meta.submitError;
                    return (
                      <FormControl
                        id="amount"
                        isInvalid={isInvalid}
                      >
                        <FormLabel mb="1px">
                          <Stack align="center" isInline spacing={1}>
                            <Text fontSize="17px" fontWeight="bold">
                              Amount
                            </Text>
                            <Popover title="Amount">
                              This is the total amount of the quote asset you are
                              willing to spend—, e.g, a value of 10 for BNBUSDT
                              would equate to buying 10 USDT worth of BNB.
                            </Popover>
                          </Stack>
                        </FormLabel>
                        <InputGroup>
                          <Input
                            name={input.name}
                            onBlur={input.onBlur}
                            onChange={input.onChange}
                            placeholder="0"
                            type="number"
                            value={input.value}
                          />
                          <InputRightAddon>{values.quoteAsset}</InputRightAddon>
                        </InputGroup>
                        <FormErrorMessage>{meta.error || meta.submitError}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Field name="schedule">
                  {({ input, meta }) => (
                    <FormControl
                      id="schedule"
                      isInvalid={meta.error && meta.touched}
                    >
                      <FormLabel mb="1px">
                        <Stack align="center" isInline spacing={1}>
                          <Text fontSize="17px" fontWeight="bold">
                            Schedule
                          </Text>
                          <Popover title="Schedule">
                            Your schedule determines when your job runs.
                            {' '}
                            If you need help generating the cron syntax for your job,
                            {' '}
                            try a cron-generator like
                            {' '}
                            <Link
                              color="blue.500"
                              href="https://crontab.cronhub.io/"
                              isExternal
                            >
                              CronTab
                            </Link>
                          </Popover>
                        </Stack>
                      </FormLabel>
                      <Input
                        name={input.name}
                        onBlur={input.onBlur}
                        onChange={input.onChange}
                        placeholder="* * * * *"
                        value={input.value}
                        isDisabled={isEditMode}
                      />
                      {!meta.error && <FormHelperText>{cronTime}</FormHelperText>}
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Box>
                  <Field name="timezone">
                    {({ meta }) => (
                      <FormControl id="timezone" isInvalid={meta.error && meta.touched}>
                        <FormLabel mb="1px">
                          <Stack align="center" isInline spacing={1}>
                            <Text fontSize="17px" fontWeight="bold">
                              Timezone
                            </Text>
                            <Popover title="Timezone">
                              Set a specific timezone for your job schedule or
                              {' '}
                              use your global default.
                            </Popover>
                          </Stack>
                        </FormLabel>
                        <Select
                          isAsync
                          isDisabled={values.useDefaultTimezone}
                          loadOptions={loadTimezones}
                          onChange={({ value }) => {
                            form.mutators.updateTimezone(value);
                          }}
                          placeholder="Africa/Lagos"
                          value={generateSelectOption(values.timezone)}
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  {defaultTimezone && (
                  <Field name="useDefaultTimezone">
                    {() => (
                      <Text
                        color="gray.500"
                        fontSize="sm"
                        mt="0.5rem"
                      >
                        Use default timezone ?
                        {'  '}
                        <Switch
                          isChecked={values.useDefaultTimezone}
                          onChange={({ target }) => {
                            if (target.checked) {
                              form.mutators.updateTimezone(defaultTimezone);
                            }
                            form.mutators.updateUseDefaultTimezone(target.checked);
                          }}
                        />
                      </Text>
                    )}
                  </Field>
                  )}
                </Box>
              </Stack>
            </form>
          );
        }}
      </Form>
    </Overlay>
  );
}

JobForm.propTypes = {
  onFormClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  job: PropTypes.shape(),
  defaultTimezone: PropTypes.string,
};

JobForm.defaultProps = {
  job: null,
  defaultTimezone: '',
};
