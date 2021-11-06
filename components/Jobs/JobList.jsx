import React, { useState } from 'react';
import {
  Grid,
  Icon,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Job from './Job';
import Loading from '../Loading';

const JobForm = dynamic(() => import('../JobForm'), { loading: () => <Loading /> });

export default function JobList({ jobs }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState(null);

  const openJobForm = (job = null) => {
    setSelectedJob(job);
    onOpen();
  };

  return (
    <Stack spacing={3}>
      <Text fontSize="xl" fontWeight="bold">{`Jobs(${jobs.length})`}</Text>
      <Grid
        gap="20px"
        templateColumns="repeat(auto-fill, minmax(min(100%, 400px), 450px))"
      >
        {jobs.map((job) => (
          <Job
            job={job}
            key={job.id}
            onEdit={() => openJobForm(job)}
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
        onClick={() => openJobForm()}
        pos="fixed"
        right="20px"
        width="60px"
        variant="unstyled"
      />
      {isOpen && (
        <JobForm
          handleClose={onClose}
          isOpen={isOpen}
          job={selectedJob}
        />
      )}
    </Stack>
  );
}

JobList.propTypes = {
  jobs: PropTypes.arrayOf().isRequired,
};
