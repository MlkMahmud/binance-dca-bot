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

export default function DisablePasswordForm({ onUpdate, setIsLoading }) {
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const { user } = await response.json();
        onUpdate(user);
      }
    } catch (e) {
      setIsLoading(false);
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
