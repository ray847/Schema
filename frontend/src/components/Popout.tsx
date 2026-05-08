import type { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';

interface PopoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Popout({
  isOpen,
  onClose,
  title,
  children,
  className,
}: PopoutProps) {
  return (
    <Dialog
      className={className}
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={isOpen}
    >
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          {title}
          <IconButton aria-label="Close" edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
