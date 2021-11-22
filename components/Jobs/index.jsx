/* eslint-env browser */
import { useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import Loading from '../Loading';
import LoadingState from './LoadingState';

const EmptyState = dynamic(() => import('./EmptyState'), { loading: () => <LoadingState /> });
const ErrorState = dynamic(() => import('./ErrorState'), { loading: () => <LoadingState /> });
const JobForm = dynamic(() => import('../JobForm'), { loading: () => <Loading /> });
const JobList = dynamic(() => import('./JobList'), { loading: () => <LoadingState /> });

export default function Jobs({ defaultTimezone }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsloading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState();

  const deleteJob = useCallback((jobId) => {
    const updatedJobs = jobs.filter(({ _id }) => _id !== jobId);
    setJobs(updatedJobs);
  }, [jobs.length]);

  // const updateJobs = useCallback((newJob, op) => {
  //   let updatedJobs;
  //   switch (op) {
  //     case 'append':
  //       updatedJobs = [...jobs, newJob];
  //       break;
  //     case 'update':
  //       updatedJobs = jobs.map((job) => {
  //         // eslint-disable-next-line no-underscore-dangle
  //         if (job._id === newJob._id) {
  //           return newJob;
  //         }
  //         return job;
  //       });
  //       break;
  //     default:
  //       throw new Error(`Op: ${op} is invalid`);
  //   }
  //   setJobs(updatedJobs);
  // }, [jobs.length]);

  const openJobForm = useCallback((id = '') => {
    const job = jobs.find(({ _id }) => _id === id);
    setSelectedJob(job);
    onOpen();
  }, [jobs.length]);

  const fetchJobs = async () => {
    try {
      setIsloading(true);
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else { throw new Error(); }
    } catch {
      setHasError(true);
    } finally { setIsloading(false); }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <ErrorState onRetry={fetchJobs} />;
  }

  return (
    <>
      {jobs.length > 0 ? (
        <JobList
          jobs={jobs}
          onDelete={deleteJob}
          openJobForm={openJobForm}
        />
      ) : <EmptyState onClick={openJobForm} />}

      {isOpen && (
      <JobForm
        defaultTimezone={defaultTimezone}
        onFormClose={onClose}
        isOpen={isOpen}
        job={selectedJob}
      />
      )}
    </>
  );
}

Jobs.propTypes = {
  defaultTimezone: PropTypes.string.isRequired,
};
