import { createStandaloneToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
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

export function generateSelectOption(value: string) {
  return {
    label: value,
    value,
  };
}

export function displayToast({
  description,
  status = 'error',
  title,
}: {
  description: string;
  status?: 'error' | 'success';
  title: string;
}) {
  const toast = createStandaloneToast();
  toast({
    description,
    duration: 5000,
    isClosable: true,
    status,
    title,
    position: 'top-right',
  });
}

export async function getSymbols(query: string) {
  const response = await fetch(`/api/symbols?q=${query}`);
  if (response.ok) {
    const { data } = await response.json();
    return data;
  }
  return [];
}

export async function getTimezones(query: string) {
  const response = await fetch(`/api/timezones?q=${query}`);
  if (response.ok) {
    const { data } = await response.json();
    return data;
  }
  return [];
}
