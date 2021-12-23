import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { displayToast } from '../client-utils';
import Logo from './Logo';
import PasswordInput from './PasswordInput';

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginForm({ onLoginSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { password: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      const { message: description } = await response.json();
      if (response.ok) {
        onLoginSuccess();
      } else {
        setIsLoading(false);
        displayToast({
          description,
          title: 'Authentication error',
        });
      }
    } catch (e) {
      setIsLoading(false);
      displayToast({
        description: 'Something went wrong please try again',
        title: 'Authentication error',
      });
    }
  };

  return (
    <Stack maxW="400px" spacing={5} width="100%">
      <Box mx="auto">
        <Logo height="80" width="80" />
      </Box>
      <Form initialValues={{ password: '' }} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form aria-label="login" onSubmit={handleSubmit}>
            <Box mb="15px">
              <Field
                name="password"
                validate={(value) =>
                  value ? undefined : 'password is required'
                }
              >
                {({ input, meta }) => (
                  <FormControl
                    isInvalid={meta.error && meta.touched}
                    isRequired
                  >
                    <FormLabel htmlFor="password">Password:</FormLabel>
                    <PasswordInput
                      id="password"
                      name={input.name}
                      onBlur={input.onBlur}
                      onChange={input.onChange}
                      value={input.value}
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Box>
            <Button
              colorScheme="black"
              type="submit"
              isFullWidth
              isLoading={isLoading}
            >
              Login
            </Button>
          </form>
        )}
      </Form>
    </Stack>
  );
}
