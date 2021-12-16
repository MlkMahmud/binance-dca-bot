import { Box, Button, Flex, Img, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import sentry from '../server/lib/sentry';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state = { hasError: false };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Flex
          align="center"
          direction="column"
          display="flex"
          justifyContent="center"
          minH="100vh"
          padding="10px"
        >
          <Box maxW="400px" mb="20px">
            <Img alt="" height="auto" maxW="100%" src="/error.png" />
          </Box>
          <Stack align="center" spacing={2}>
            <Text color="#36454F" maxW="300px" textAlign="center">
              An unexpected error has occured. Please try refreshing the page
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
              textDecor="underline"
              variant="link"
            >
              Refresh page
            </Button>
          </Stack>
        </Flex>
      );
    }

    return this.props.children;
  }
}
