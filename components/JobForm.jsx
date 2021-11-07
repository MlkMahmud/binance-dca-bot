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
import cronstrue from 'cronstrue';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { generateSelectOption } from '../utils';
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
  const initialValues = isEditMode ? job : {
    useDefaultTimezone: false,
  };
  const subTitle = isEditMode ? 'Edit your job details' : 'Create a new recurring job';
  const title = isEditMode ? 'Edit Job' : 'Create Job';
  const [isLoading, setIsLoading] = useState(false);
  const [minNotional, setMinNotional] = useState(0);
  const [cronTime, setCronTime] = useState('');
  const btnRef = useRef();

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
        const interval = cronstrue.toString(values.schedule, { verbose: true });
        setCronTime(interval);
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
    setIsLoading(true);
    if (isEditMode) {
      const response = await fetch(`/api/symbols?q=${values.symbol}`);
      const [symbol] = await response.json();
      if (symbol.minNotional > +values.amount) {
        setIsLoading(false);
        return { amount: `Amount must be greater than or eqaul to ${symbol.minNotional}` };
      }
    }
    const sleep = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 2000);
    });
    await sleep();
    alert(JSON.stringify(values, null, 2));
    setIsLoading(false);
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
                        loadOptions={async (query) => {
                          const response = await fetch(
                            `/api/symbols?q=${query}`,
                          );
                          if (response.ok) {
                            const symbols = await response.json();
                            return symbols;
                          }
                          return [];
                        }}
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
                            <Popover title="amount">
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
                          <Popover title="schedule">
                            Your schedule determines when your job runs.
                            {' '}
                            If you need help generating the cron syntax for your job,
                            {' '}
                            try a cron-generator like
                            {' '}
                            <Link
                              color="blue.500"
                              href="http://www.cronmaker.com/"
                              isExternal
                            >
                              CronMaker
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
                            <Popover title="schedule">
                              Set a specific timezone for your job schedule or
                              {' '}
                              use your global default.
                            </Popover>
                          </Stack>
                        </FormLabel>
                        <Select
                          isAsync
                          isDisabled={values.useDefaultTimezone}
                          loadOptions={async (query) => {
                            const response = await fetch(
                              `/api/timezones?q=${query}`,
                            );
                            if (response.ok) {
                              const timezones = await response.json();
                              return timezones;
                            }
                            return [];
                          }}
                          onChange={({ value }) => {
                            form.mutators.updateTimezone(value);
                          }}
                          placeholder="Africa/Lagos"
                          value={values.useDefaultTimezone
                            ? generateSelectOption(defaultTimezone)
                            : generateSelectOption(values.timezone)}
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
                            } else {
                              form.mutators.updateTimezone('');
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
