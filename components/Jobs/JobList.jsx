import {
  Box,
  Icon,
  IconButton,
  Table,
  Tbody,
  Text,
  Thead,
  Tr,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import TableCell from '../TableCell';
import Job from './Job';

export default function JobList({
  jobs,
  onDelete,
  openJobForm,
}) {
  return (
    <Box overflow="auto">
      <Text fontSize="xl" fontWeight="bold">{`Jobs(${jobs.length})`}</Text>
      <Box
        border="1px solid #DADCE0"
        borderBottom="none"
        borderRadius="5px 5px 0 0"
        height="fit-content"
        marginTop="20px"
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
            {jobs.map((job) => {
              const {
                _id,
                data,
                disabled,
                lastRunAt,
                nextRunAt,
                repeatTimezone,
              } = job;
              return (
                <Job
                  key={_id}
                  amount={`${data.amount} ${data.quoteAsset}`}
                  disabled={disabled}
                  id={_id}
                  interval={data.humanInterval}
                  lastRun={lastRunAt}
                  name={data.jobName}
                  nextRun={nextRunAt}
                  onDelete={onDelete}
                  onEdit={openJobForm}
                  symbol={data.symbol}
                  timezone={repeatTimezone}
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
        onClick={openJobForm}
        pos="fixed"
        right="20px"
        width="60px"
        variant="unstyled"
      />
    </Box>
  );
}

JobList.propTypes = {
  jobs: PropTypes.arrayOf().isRequired,
  onDelete: PropTypes.func.isRequired,
  openJobForm: PropTypes.func.isRequired,
};
