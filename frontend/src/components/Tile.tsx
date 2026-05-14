import { Paper, type PaperProps } from '@mui/material';

export function Tile({ sx, ...props }: PaperProps) {
  const sxList = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Paper
      elevation={0}
      {...props}
      sx={[
        {
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxSizing: 'border-box',
          p: 3,
        },
        ...sxList,
      ]}
    />
  );
}
