/* eslint-env browser */
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useRouter } from 'next/router';
import Logo from './Logo';
import PasswordInput from './PasswordInput';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const id = 'toastId';

  const displayToast = (description) => {
    if (!toast.isActive(id)) {
      toast({
        id,
        title: 'Authentication error',
        isClosable: true,
        duration: 5000,
        status: 'error',
        description,
      });
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      const { message } = await response.json();
      if (response.ok) {
        router.replace('/');
      } else {
        setIsLoading(false);
        displayToast(message);
      }
    } catch (e) {
      setIsLoading(false);
      displayToast('Something went wrong please try again');
    }
  };

  return (
    <Stack maxW="400px" spacing={5} width="100%">
      <Box mx="auto">
        <Logo height="80" width="80" />
      </Box>
      <Form initialValues={{ password: '' }} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box mb="15px">
              <Field
                name="password"
                validate={(value) => (value ? undefined : 'password is required')}
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
