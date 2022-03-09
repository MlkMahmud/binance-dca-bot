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
import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { displayToast, useMediaQuery } from '../../client-utils';
import { Job as JobType } from '../../types';
import OrderHistory from '../OrderHistory';
import Prompt from '../Prompt';
import TableCell from '../TableCell';
import Job from './Job';

type Action = 'edit' | 'delete' | 'history' | 'status';

type Props = {
  defaultTimezone?: string;
  jobs: JobType[];
  handleDelete: (jobId: string) => void;
  handleUpdate: (job: JobType, op: string) => void;
  openJobForm: (jobId?: string) => void;
};

export default function JobList({
  defaultTimezone,
  jobs,
  handleDelete,
  handleUpdate,
  openJobForm,
}: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 500px)');
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string>('');
  const [op, setOp] = useState<Action>();
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const selectedJob = jobs.find(({ _id }) => _id === jobId);
  const isDeleteMode = op === 'delete';

  const handleButtonClick = (id: string, action: Action) => {
    switch (action) {
      case 'edit':
        openJobForm(id);
        break;
      case 'delete':
      case 'status':
        setJobId(id);
        setOp(action);
        onOpen();
        break;
      case 'history':
        setJobId(id);
        setShowOrderHistory(true);
        break;
      default:
        throw new Error(
          'Action must be one of edit | delete | history | status'
        );
    }
  };

  const jobsArray = jobs.map((job) => (
    <Job
      key={job._id}
      amount={`${job.data.amount} ${job.data.quoteAsset}`}
      disabled={job.data.paused ? true : false}
      id={job._id}
      interval={job.data.humanInterval}
      isMobile={isMobile}
      lastRun={job.lastRunAt}
      name={job.data.jobName}
      nextRun={job.nextRunAt}
      onButtonClick={handleButtonClick}
      symbol={job.data.symbol}
      timezone={
        job.data.useDefaultTimezone && defaultTimezone
          ? defaultTimezone
          : job.repeatTimezone
      }
    />
  ));

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      const { message: description } = await response.json();
      if (response.ok) {
        onClose();
        handleDelete(jobId);
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
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const onUpdate = async () => {
    try {
      setIsLoading(true);
      const job = jobs.find(({ _id }) => _id === jobId) as JobType;
      const payload = { paused: true };
      if (job.data.paused) {
        payload.paused = false;
      }
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const { data: updatedJob, message: description } = await response.json();
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
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb="20px"
        >{`Jobs(${jobs.length})`}</Text>
        {isMobile ? (
          <>{jobsArray}</>
        ) : (
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
              <Tbody>{jobsArray}</Tbody>
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
          display="inline-flex"
          height="60px"
          icon={<Icon as={FaPlus} boxSize="24px" />}
          onClick={() => openJobForm()}
          pos="fixed"
          right="20px"
          width="60px"
          variant="unstyled"
          zIndex={4}
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
        >
          {isDeleteMode
            ? 'Deleting this job will also delete all of its related data, are you sure you want to continue?'
            : 'Please click the confirm button to proceed.'}
        </Prompt>
      )}
      {showOrderHistory && (
        <OrderHistory
          isOpen={showOrderHistory}
          jobId={jobId}
          jobName={selectedJob?.data.jobName || ''}
          onClose={() => setShowOrderHistory(false)}
        />
      )}
    </>
  );
}
