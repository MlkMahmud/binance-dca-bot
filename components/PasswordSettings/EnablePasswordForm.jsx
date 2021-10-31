/* eslint-env browser */
import {
  FormControl, FormLabel, Stack, Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Form } from 'react-final-form';
import PasswordInput from '../PasswordInput';

export default function EnablePasswordForm({
  hasSetPassword,
  onUpdate,
  setIsLoading,
}) {
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const method = hasSetPassword ? 'PUT' : 'POST';
      const response = await fetch('/api/settings/password', {
        headers: { 'content-type': 'application/json' },
        method,
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const { user } = await response.json();
        onUpdate(user);
      } else {
        throw new Error(response.statusText);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack mb="20px">
        <Text fontSize="xl" fontWeight="semibold">
          Enable password protection
        </Text>
        <Text colorScheme="gray.600" fontWeight="normal">
          {hasSetPassword
            ? 'You must confirm your password to enable the password protection feature'
            : 'You must create a new password in order to enable the password protection feature'}
        </Text>
      </Stack>
      <Form
        initialValues={{
          ...(hasSetPassword && { action: 'enable' }),
          ...(!hasSetPassword && { confirmPassword: '' }),
          password: '',
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <form id="enable" onSubmit={handleSubmit}>
            {hasSetPassword ? (
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
            ) : (
              <Stack spacing={3}>
                <Field name="password">
                  {({ input }) => (
                    <FormControl id="password">
                      <FormLabel>New password: </FormLabel>
                      <PasswordInput
                        onBlur={input.onBlur}
                        onChange={input.onChange}
                        value={input.value}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="confirmPassword">
                  {({ input }) => (
                    <FormControl id="confirmPassword">
                      <FormLabel>Confirm password: </FormLabel>
                      <PasswordInput
                        onBlur={input.onBlur}
                        onChange={input.onChange}
                        value={input.value}
                      />
                    </FormControl>
                  )}
                </Field>
              </Stack>
            )}
          </form>
        )}
      </Form>
    </>
  );
}

EnablePasswordForm.propTypes = {
  hasSetPassword: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};
