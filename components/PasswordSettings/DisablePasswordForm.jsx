/* eslint-env browser */
import {
  FormControl,
  FormLabel,
  Stack,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Form } from 'react-final-form';
import PasswordInput from '../PasswordInput';
import { displayToast } from '../../utils';

export default function DisablePasswordForm({ onUpdate, setIsLoading }) {
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      const { message: description } = await response.json();
      if (response.ok) {
        displayToast({
          description,
          status: 'success',
          title: 'Success',
        });
        onUpdate();
      } else {
        setIsLoading(false);
        displayToast({
          description,
          title: 'Error',
        });
      }
    } catch (e) {
      setIsLoading(false);
      displayToast({
        description: 'Something went wrong, please try again.',
        title: 'Error',
      });
    }
  };

  return (
    <>
      <Stack mb="20px">
        <Text fontSize="xl" fontWeight="semibold">
          Disable password protection
        </Text>
        <Text colorScheme="gray.600" fontWeight="normal">
          You must confirm your password to disable the password protection feature
        </Text>
      </Stack>
      <Form
        initialValues={{
          action: 'disable',
          password: '',
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <form id="disable" onSubmit={handleSubmit}>
            <Field name="password">
              {({ input }) => (
                <FormControl id="password">
                  <FormLabel>Password: </FormLabel>
                  <PasswordInput
                    onBlur={input.onBlur}
                    onChange={input.onChange}
                    value={input.value}
                  />
                </FormControl>
              )}
            </Field>
          </form>
        )}
      </Form>
    </>
  );
}

DisablePasswordForm.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};
