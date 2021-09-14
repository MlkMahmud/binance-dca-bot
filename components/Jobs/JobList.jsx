import React from 'react';
import {
  Grid,
  Icon,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Job from './Job';

export default function JobList({ handleClick, jobs }) {
  return (
    <Stack spacing={3}>
      <Text fontSize="xl" fontWeight="bold">{`Jobs(${jobs.length})`}</Text>
      <Grid
        gap="20px"
        templateColumns="repeat(auto-fill, minmax(min(100%, 400px), 450px))"
      >
        {jobs.map(({
          baseAsset, id, interval, isActive, name, quoteAsset,
        }) => (
          <Job
            baseAsset={baseAsset}
            id={id}
            interval={interval}
            isActive={isActive}
            key={id}
            name={name}
            quoteAsset={quoteAsset}
          />
        ))}
      </Grid>
      <IconButton
        aria-label="add new job"
        bgColor="black"
        borderRadius="50%"
        bottom="40px"
        color="white"
        colorScheme="black"
        height="60px"
        icon={<Icon as={FaPlus} boxSize="24px" />}
        onClick={handleClick}
        pos="fixed"
        right="20px"
        width="60px"
        variant="unstyled"
      />
    </Stack>
  );
}

JobList.propTypes = {
  handleClick: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf().isRequired,
};
