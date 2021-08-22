import React from 'react';
import {
  Icon,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AiFillGithub, AiFillTwitterSquare } from 'react-icons/ai';

export default function Footer() {
  return (
    <Stack
      align="center"
      as="footer"
      borderTop="1px solid black"
      direction={['column', 'row']}
      justify={['center', 'space-between']}
      px={[2, 5]}
      py={4}
      spacing={[4, null]}
    >
      <Text>
        Copyright &copy;
        {' '}
        <b>Malik Mahmud, 2021.</b>
      </Text>
      <Stack direction="row" spacing={1}>
        <Link
          aria-label="github"
          href="https://github.com/MlkMahmud"
        >
          <Icon as={AiFillGithub} boxSize="40px" />
        </Link>
        <Link
          aria-label="twitter"
          href="https://twitter.com/M_Shuttleworth_"
        >
          <Icon as={AiFillTwitterSquare} boxSize="40px" />
        </Link>
      </Stack>
    </Stack>
  );
}
