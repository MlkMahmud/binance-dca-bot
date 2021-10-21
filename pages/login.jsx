import React from 'react';
import { Flex } from '@chakra-ui/react';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <Flex justifyContent="center" mt="10vh" minH="90vh" padding="10px">
      <LoginForm />
    </Flex>
  );
}
