import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Logo from './Logo';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack maxW="400px" spacing={5} width="100%">
      <Box mx="auto">
        <Logo height="80" width="80" />
      </Box>
      <Form
        initialValues={{ password: '' }}
        onSubmit={() => {}}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Box>
                <Field name="password" validate={(value) => (value ? undefined : 'password is required')}>
                  {({ input, meta }) => (
                    <FormControl
                      isInvalid={meta.error && meta.touched}
                      isRequired
                    >
                      <FormLabel htmlFor="password">Password:</FormLabel>
                      <InputGroup>
                        <Input
                          id="password"
                          name={input.name}
                          onBlur={input.onBlur}
                          onChange={input.onChange}
                          type={showPassword ? 'text' : 'password'}
                          value={input.value}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label="toggle password visibility"
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="unstyled"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
              <Button colorScheme="black" type="submit">
                Login
              </Button>
            </Stack>
          </form>
        )}
      </Form>
    </Stack>
  );
}
