/* eslint-env browser */
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Form } from 'react-final-form';
import PasswordInput from '../PasswordInput';
import { displayToast } from '../../utils';

export default function EnablePasswordForm({
  hasSetPassword,
  onUpdate,
  setIsLoading,
}) {
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const method = hasSetPassword ? 'PATCH' : 'POST';
      const response = await fetch('/api/settings/password', {
        headers: { 'content-type': 'application/json' },
        method,
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
    } catch {
      setIsLoading(false);
      displayToast({
        description: 'Something went wrong, please try again.',
        title: 'Error',
      });
    }
  };

  const validate = ({ confirmPassword, password }) => {
    const errors = {};
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!hasSetPassword && confirmPassword !== password) {
      errors.confirmPassword = 'Confirm password must match password field';
    }

    return errors;
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
        validate={validate}
      >
        {({ handleSubmit }) => (
          <form id="enable" onSubmit={handleSubmit}>
            {hasSetPassword ? (
              <Field name="password">
                {({ input, meta }) => (
                  <FormControl id="password" isInvalid={meta.error && meta.touched}>
                    <FormLabel>Password: </FormLabel>
                    <PasswordInput
                      onBlur={input.onBlur}
                      onChange={input.onChange}
                      value={input.value}
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            ) : (
              <Stack spacing={3}>
                <Field name="password">
                  {({ input, meta }) => (
                    <FormControl id="password" isInvalid={meta.error && meta.touched}>
                      <FormLabel>New password: </FormLabel>
                      <PasswordInput
                        onBlur={input.onBlur}
                        onChange={input.onChange}
                        value={input.value}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="confirmPassword">
                  {({ input, meta }) => (
                    <FormControl id="confirmPassword" isInvalid={meta.error && meta.touched}>
                      <FormLabel>Confirm password: </FormLabel>
                      <PasswordInput
                        onBlur={input.onBlur}
                        onChange={input.onChange}
                        value={input.value}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
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
