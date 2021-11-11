import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { SxProps } from '@mui/system';

interface EditorDialogProps {
  title: string;
  sx?: SxProps;
  canSubmit: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}
export const EditorDialog = (props: EditorDialogProps) => {
  const { canSubmit, title, children, sx, onClose, onSubmit } = props;
  const [open, setOpen] = useState(true);
  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    setOpen(false);
    onSubmit();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth sx={{ pb: '10%' }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={sx}>{children}</DialogContent>
      <DialogActions>
        <Button disabled={!canSubmit} onClick={handleSubmit}>
          Save
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
