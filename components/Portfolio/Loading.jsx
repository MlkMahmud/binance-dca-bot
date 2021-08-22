import React from 'react';
import {
  Box,
  Flex,
  Grid,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';

export default function LoadingState() {
  return (
    <Box
      bgColor="#FFF"
      maxW="650px"
      shadow="rgb(0 0 0 / 16%) 0px 1px 2px -2px, rgb(0 0 0 / 12%) 0px 3px 6px 0px, rgb(0 0 0 / 9%) 0px 5px 12px 4px"
    >
      <Flex
        align="center"
        justify="space-between"
        p={2.5}
      >
        <SkeletonText noOfLines={1} w="96px" />
        <HStack spacing={2}>
          <SkeletonCircle size={['35px', '40px']} />
          <SkeletonCircle size={['35px', '40px']} />
        </HStack>
      </Flex>
      <Box p="15px 10px">
        <Grid
          alignItems="center"
          columnGap="2%"
          templateColumns="auto 1fr"
          mb="20px"
        >
          <SkeletonCircle size="30px" />
          <Skeleton h="40px" />
        </Grid>
        <Skeleton h="20px" mb="5px" />
        <Skeleton h="20px" mb="5px" />
      </Box>
      <Box
        p={2.5}
      >
        <Skeleton h="20px" />
      </Box>
    </Box>
  );
}
