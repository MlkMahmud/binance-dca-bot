/* eslint-disable no-underscore-dangle */
/* eslint-env browser */
import {
  Box,
  Icon,
  IconButton,
  Table,
  Tbody,
  Text,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { displayToast, useMediaQuery } from '../../utils';
import TableCell from '../TableCell';
import Job from './Job';
import Prompt from '../Prompt';

export default function JobList({
  jobs,
  handleDelete,
  handleUpdate,
  openJobForm,
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 500px)');
  const btnRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState();
  const [op, setOp] = useState();

  const isDeleteMode = op === 'delete';
  const handleButtonClick = useCallback((id, action) => {
    if (action === 'edit') {
      openJobForm(id);
    } else if (action === 'delete' || action === 'status') {
      setJobId(id);
      setOp(action);
      onOpen();
    } else {
      throw new Error('Action must be one of edit | delete | status');
    }
  }, []);

  const jobsArray = jobs.map((job) => (
    <Job
      key={job._id}
      amount={`${job.data.amount} ${job.data.quoteAsset}`}
      disabled={job.disabled}
      id={job._id}
      interval={job.data.humanInterval}
      isMobile={isMobile}
      lastRun={job.lastRunAt}
      name={job.data.jobName}
      nextRun={job.nextRunAt}
      onButtonClick={handleButtonClick}
      symbol={job.data.symbol}
      timezone={job.repeatTimezone}
    />
  ));

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      const { message: description } = await response.json();
      if (response.ok) {
        handleDelete(jobId);
        onClose();
        displayToast({
          description,
          status: 'success',
          title: 'Success',
        });
      } else {
        displayToast({
          description,
          title: 'Error',
        });
      }
    } catch {
      displayToast({
        description: 'Something went wrong, please try again',
        title: 'Error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate = async () => {
    try {
      setIsLoading(true);
      const job = jobs.find(({ _id }) => _id === jobId);
      const payload = {};
      if (job.disabled) {
        payload.enable = true;
      } else {
        payload.disable = true;
      }
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const { job: updatedJob, message: description } = await response.json();
      if (response.ok) {
        handleUpdate(updatedJob, 'update');
        onClose();
        displayToast({
          description: 'Job updated successfully',
          status: 'success',
          title: 'Success',
        });
      } else {
        displayToast({
          description,
          title: 'Error',
        });
      }
    } catch {
      displayToast({
        description: 'Something went wrong, please try again',
        title: 'Error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box overflow="auto">
        <Text fontSize="xl" fontWeight="bold" mb="20px">{`Jobs(${jobs.length})`}</Text>
        {isMobile ? (<>{jobsArray}</>) : (
          <Box
            border="1px solid #DADCE0"
            borderBottom="none"
            borderRadius="5px 5px 0 0"
            height="fit-content"
            maxHeight="500px"
            overflow="auto"
            shadow="0 0 5px 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 15%), 0 0 0 1px rgb(63 63 68 / 5%), 0 1px 3px 0 rgb(63 63 68 / 15%)"
          >
            <Table
              css={{
                borderCollapse: 'separate',
                borderSpacing: 0,
              }}
            >
              <Thead>
                <Tr>
                  <TableCell isFixed isHeading>
                    Job Name
                  </TableCell>
                  <TableCell isHeading>Symbol</TableCell>
                  <TableCell isHeading>Amount</TableCell>
                  <TableCell isHeading>Interval</TableCell>
                  <TableCell isHeading>Timezone</TableCell>
                  <TableCell isHeading>Last Run</TableCell>
                  <TableCell isHeading>Next Run</TableCell>
                  <TableCell isHeading>Action</TableCell>
                </Tr>
              </Thead>
              <Tbody>
                {jobsArray}
              </Tbody>
            </Table>
          </Box>
        )}
        <IconButton
          aria-label="add new job"
          bgColor="black"
          borderRadius="50%"
          bottom="40px"
          color="white"
          colorScheme="black"
          height="60px"
          icon={<Icon as={FaPlus} boxSize="24px" />}
          onClick={openJobForm}
          pos="fixed"
          right="20px"
          width="60px"
          variant="unstyled"
        />
      </Box>
      {isOpen && (
        <Prompt
          destructive={isDeleteMode}
          heading={isDeleteMode ? 'Delete job' : 'Edit Job'}
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={() => {
            if (!isLoading) {
              onClose();
            }
          }}
          onConfirm={isDeleteMode ? onDelete : onUpdate}
          ref={btnRef}
        >
          {isDeleteMode
            ? 'Deleting this job will also delete all of its related data, are you sure you want to continue?'
            : 'Please click the confirm button to proceed.'}
        </Prompt>
      )}
    </>
  );
}

JobList.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf().isRequired,
  openJobForm: PropTypes.func.isRequired,
};
