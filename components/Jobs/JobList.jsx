import React from 'react';
import { Grid, Stack, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Job from './Job';

export default function JobList({ jobs }) {
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
    </Stack>
  );
}

JobList.propTypes = {
  jobs: PropTypes.arrayOf().isRequired,
};
