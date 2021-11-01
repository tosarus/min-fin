import React from 'react';
import { Button } from '@mui/material';
import { SxProps } from '@mui/system';

type OpenFileButtonProps = {
  sx?: SxProps;
  children: React.ReactChild;
  accept?: string;
} & (
  | {
      onFile?: (file: File) => void;
      onText?: never;
    }
  | {
      onFile?: never;
      onText?: (result: string) => void;
    }
);

export const OpenFileButton = ({ sx, children, accept, onFile, onText }: OpenFileButtonProps) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files?.length) {
      if (onFile) {
        onFile(e.target.files[0]);
      } else if (onText) {
        const reader = new FileReader();
        reader.onload = () => onText(reader.result as string);
        reader.readAsText(e.target.files[0]);
      }
    }
    e.target.value = '';
  };
  return (
    <Button sx={sx} component="label">
      {children}
      <input onChange={handleFileInput} accept={accept} type="file" hidden />
    </Button>
  );
};
