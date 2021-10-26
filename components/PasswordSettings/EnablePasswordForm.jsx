/* eslint-env browser */
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Form } from 'react-final-form';

export default function EnablePasswordForm({ hasSetPassword, onUpdate, setIsLoading }) {
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
      } else { throw new Error(response.statusText); }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Form
      initialValues={{
        action: hasSetPassword ? 'enable' : undefined,
        confirmPassword: hasSetPassword ? '' : undefined,
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
                  <FormLabel>Confirm password: </FormLabel>
                  <Input
                    name={input.name}
                    onBlur={input.onBlur}
                    onChange={input.onChange}
                    type="password"
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
                    <Input
                      name={input.name}
                      onBlur={input.onBlur}
                      onChange={input.onChange}
                      type="password"
                      value={input.value}
                    />
                  </FormControl>
                )}
              </Field>
              <Field name="confirmPassword">
                {({ input }) => (
                  <FormControl id="confirmPassword">
                    <FormLabel>Confirm password: </FormLabel>
                    <Input
                      name={input.name}
                      onBlur={input.onBlur}
                      onChange={input.onChange}
                      type="password"
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
  );
}

EnablePasswordForm.propTypes = {
  hasSetPassword: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};
