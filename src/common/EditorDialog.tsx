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
  onRemove?: () => void;
}

export const EditorDialog = (props: EditorDialogProps) => {
  const { canSubmit, title, children, sx, onClose, onSubmit, onRemove } = props;
  const [open, setOpen] = useState(true);
  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    setOpen(false);
    onSubmit();
  };

  const handleRemove = () => {
    setOpen(false);
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth sx={{ pb: '10%' }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={sx}>{children}</DialogContent>
      <DialogActions sx={{ pl: 2, pr: 2 }}>
        {onRemove && (
          <Button sx={{ mr: 'auto' }} onClick={handleRemove}>
            Remove
          </Button>
        )}
        <Button disabled={!canSubmit} onClick={handleSubmit} type="submit">
          Save
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
