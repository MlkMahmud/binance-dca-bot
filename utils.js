/* eslint-disable no-undef */
import { createStandaloneToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function generateSelectOption(value) {
  return {
    label: value,
    value,
  };
}

export function displayToast({ description, status = 'error', title }) {
  const toast = createStandaloneToast();
  toast({
    description,
    duration: 5000,
    isClosable: true,
    status,
    title,
  });
}
