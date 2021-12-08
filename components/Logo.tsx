import React from 'react';

type Props = {
  height?: string;
  width?: string;
}

export default function Logo({ width = '50', height = '50' }: Props) {
  return (
    <a href="/" aria-label="homepage">
      <svg
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M57.813 56.25h7.812a3.13 3.13 0 013.125 3.125v12.5h-3.125v-12.5h-31.25v12.5H31.25v-12.5a3.13 3.13 0 013.125-3.125h7.813v-3.125h-1.563A3.13 3.13 0 0137.5 50v-6.25h-3.125v-3.125H37.5V37.5a3.13 3.13 0 013.125-3.125h3.125v-6.25h3.125v6.25h6.25v-6.25h3.125v6.25h3.125A3.13 3.13 0 0162.5 37.5v3.125h3.125v3.125H62.5V50a3.129 3.129 0 01-3.125 3.125h-1.563v3.125zm1.562-18.75h-18.75V50h18.75V37.5zm-4.688 15.625h-9.374v3.125h9.374v-3.125zm-7.812-12.5H43.75v3.125h3.125v-3.125zm9.375 0h-3.125v3.125h3.125v-3.125z"
          fill="#000"
        />
        <path
          d="M50 93.75a43.75 43.75 0 110-87.5 43.75 43.75 0 010 87.5zm0-81.25a37.5 37.5 0 100 75.001A37.5 37.5 0 0050 12.5z"
          fill="#000"
        />
      </svg>
    </a>
  );
}
