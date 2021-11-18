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

export default function UpdatePasswordForm({ setIsLoading, onUpdate }) {
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/password', {
        method: 'PATCH',
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

  const validate = ({ newPassword, password }) => {
    const errors = {};
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long.';
    } else if (newPassword === password) {
      errors.newPassword = 'New password cannot be the same as the old password';
    }

    return errors;
  };

  return (
    <>
      <Stack mb="20px">
        <Text fontSize="xl" fontWeight="semibold">
          Update password
        </Text>
        <Text colorScheme="gray.600" fontWeight="normal">
          Please ensure your new password and your old password are not the same.
        </Text>
      </Stack>
      <Form
        initialValues={{
          action: 'update',
          newPassword: '',
          password: '',
        }}
        onSubmit={onSubmit}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <form id="update" onSubmit={handleSubmit}>
            <Stack spacing={3}>
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
              <Field name="newPassword">
                {({ input, meta }) => (
                  <FormControl id="newPassword" isInvalid={meta.error && meta.touched}>
                    <FormLabel>New Password: </FormLabel>
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
          </form>
        )}
      </Form>
    </>
  );
}

UpdatePasswordForm.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
