import React, { useState } from 'react';
import {
  Box,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Job from './Job';
import Loading from '../Loading';
import TableCell from '../TableCell';

const JobForm = dynamic(() => import('../JobForm'), { loading: () => <Loading /> });

export default function JobList({ defaultTimezone, jobs }) {
  const { isOpen, onClose: handleClose, onOpen } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState(null);

  const openJobForm = (job = null) => {
    setSelectedJob(job);
    onOpen();
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">{`Jobs(${jobs.length})`}</Text>
      <Box
        border="1px solid #DADCE0"
        borderBottom="none"
        borderRadius="5px 5px 0 0"
        overflow="auto"
      >
        <Table
          css={{
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
        >
          <Thead>
            <Tr>
              <TableCell
                isFixed
                isHeading
              >
                Job Name
              </TableCell>
              <TableCell isHeading>Symbol</TableCell>
              <TableCell isHeading>Amount</TableCell>
              <TableCell isHeading>Schedule</TableCell>
              <TableCell isHeading>Timezone</TableCell>
              <TableCell isHeading>Last Run</TableCell>
              <TableCell isHeading>Next Run</TableCell>
            </Tr>
          </Thead>
          <Tbody>
            {jobs.map((job) => {
              const {
                amount,
                disabled,
                lastRun,
                name,
                nextRun,
                schedule,
                symbol,
                timezone,

              } = job;
              return (
                <Job
                  key={name}
                  amount={amount}
                  disabled={disabled}
                  lastRun={lastRun}
                  name={name}
                  nextRun={nextRun}
                  schedule={schedule}
                  symbol={symbol}
                  timezone={timezone}
                />
              );
            })}
          </Tbody>
        </Table>
      </Box>
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
        defaultTimezone={defaultTimezone}
        onFormClose={handleClose}
        isOpen={isOpen}
        job={selectedJob}
      />
      )}
    </>
  );
}

JobList.propTypes = {
  defaultTimezone: PropTypes.string.isRequired,
  jobs: PropTypes.arrayOf().isRequired,
};
