import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
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
import * as Yup from 'yup';
import Logo from './Logo';

const validationSchema = Yup.object({
  password: Yup.string().required(),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack maxW="400px" spacing={5} width="100%">
      <Box mx="auto">
        <Logo height="80" width="80" />
      </Box>
      <Formik
        initialValues={{ password: '' }}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <Stack spacing={4}>
              <Box>
                <Field name="password">
                  {({ field, meta }) => (
                    <FormControl
                      isInvalid={meta.error && meta.touched}
                      isRequired
                    >
                      <FormLabel htmlFor="password">Password:</FormLabel>
                      <InputGroup>
                        <Input
                          id="password"
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          type={showPassword ? 'text' : 'password'}
                          value={field.value}
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
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
