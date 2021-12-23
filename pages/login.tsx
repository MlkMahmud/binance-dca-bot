import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const router = useRouter();
  return (
    <Flex justifyContent="center" mt="10vh" minH="90vh" padding="10px">
      <LoginForm onLoginSuccess={() => router.replace('/')} />
    </Flex>
  );
}

export async function getServerSideProps({ req }: any) {
  const { user } = req;
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  return { props: {} };
}
