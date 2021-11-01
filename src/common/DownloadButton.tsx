import React from 'react';
import { Button } from '@mui/material';
import { SxProps } from '@mui/system';
import { DownloadTargetProps, DownloadTarget } from './DownloadTarget';

interface DownloadButtonProps {
  sx?: SxProps;
  children: React.ReactChild;
  onClick: () => void;
}

export function DownloadButton<Store, State>({
  sx,
  children,
  onClick,
  ...target
}: DownloadButtonProps & DownloadTargetProps<Store, State>) {
  return (
    <>
      <Button sx={sx} onClick={onClick}>
        {children}
      </Button>
      <DownloadTarget {...target} />
    </>
  );
}
