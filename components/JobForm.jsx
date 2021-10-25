/* eslint-env browser */
import React, { useRef, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Field, Form } from 'react-final-form';
import PropTypes from 'prop-types';
import Overlay from './Overlay';
import Popover from './Popover';
import Select from './Select';
import { generateSelectOption } from '../utils';

export default function JobForm({ handleClose, isOpen, job }) {
  const isEditMode = !!job;
  const initialValues = isEditMode ? job : {};
  const subTitle = isEditMode ? 'Edit your job details' : 'Create a new recurring job';
  const title = isEditMode ? 'Edit Job' : 'Create Job';
  const [isLoading, setIsLoading] = useState(false);
  const btnRef = useRef();

  const onSubmit = async () => {
    setIsLoading(true);
    const sleep = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 2000);
    });
    await sleep();
    handleClose();
  };

  return (
    <Overlay
      formId="job"
      handleClose={() => {
        if (!isLoading) {
          handleClose();
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
        }}
        onSubmit={onSubmit}
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
                  {({ input }) => (
                    <FormControl id="name">
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
                    </FormControl>
                  )}
                </Field>
                <Field name="symbol">
                  {() => (
                    <FormControl id="symbol">
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
                        onChange={({ value }) => form.mutators.updateSymbol(value)}
                        placeholder="BNBUSDT"
                        value={generateSelectOption(values.symbol)}
                      />
                    </FormControl>
                  )}
                </Field>
              </Stack>
            </form>
          );
        }}
      </Form>
    </Overlay>
  );
}

JobForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  job: PropTypes.shape(),
};

JobForm.defaultProps = {
  job: null,
};
