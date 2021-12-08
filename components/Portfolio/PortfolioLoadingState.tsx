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
      border="1px solid #DADCE0"
      borderRadius="5px"
      maxW="650px"
    >
      <Flex
        align="center"
        justify="space-between"
        p={2.5}
      >
        <SkeletonText noOfLines={1} w="96px" />
        <HStack spacing={2}>
          <SkeletonCircle size="35px" />
          <SkeletonCircle size="35px" />
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
