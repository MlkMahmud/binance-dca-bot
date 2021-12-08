import { useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import Loading from '../Loading';
import JobListLoadingState from './JobListLoadingState';
import { Job } from '../../types';

const JobListEmptyState = dynamic(() => import('./JobListEmptyState'), { loading: () => <JobListLoadingState /> });
const JobListErrorState = dynamic(() => import('./JobListErrorState'), { loading: () => <JobListLoadingState /> });
const JobForm = dynamic(() => import('../JobForm'), { loading: () => <Loading /> });
const JobList = dynamic(() => import('./JobList'), { loading: () => <JobListLoadingState /> });

type Props = {
  defaultTimezone?: string;
}

export default function Jobs({ defaultTimezone }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsloading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job>();

  const deleteJob = useCallback((jobId) => {
    const updatedJobs = jobs.filter(({ _id }) => _id !== jobId);
    setJobs(updatedJobs);
  }, [jobs.length]);

  const updateJobs = useCallback((newJob: Job, op: string) => {
    let updatedJobs;
    switch (op) {
      case 'append':
        updatedJobs = [...jobs, newJob];
        break;
      case 'update':
        updatedJobs = jobs.map((job) => {
          if (job._id === newJob._id) {
            return newJob;
          }
          return job;
        });
        break;
      default:
        throw new Error(`Op: ${op} is invalid`);
    }
    setJobs(updatedJobs);
    onClose();
  }, [jobs.length]);

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
    return <JobListLoadingState />;
  }

  if (hasError) {
    return <JobListErrorState onRetry={fetchJobs} />;
  }

  return (
    <>
      {jobs.length > 0 ? (
        <JobList
          handleDelete={deleteJob}
          handleUpdate={updateJobs}
          jobs={jobs}
          openJobForm={openJobForm}
        />
      ) : <JobListEmptyState onClick={openJobForm} />}

      {isOpen && (
      <JobForm
        defaultTimezone={defaultTimezone}
        isOpen={isOpen}
        job={selectedJob}
        onFormClose={onClose}
        onSubmitSuccess={updateJobs}
      />
      )}
    </>
  );
}

Jobs.propTypes = {
  defaultTimezone: PropTypes.string.isRequired,
};
