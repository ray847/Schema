import { Paper, type PaperProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface TileProps extends PaperProps {
  tone?: 'container' | 'high' | 'sheet';
}

export function Tile({ sx, tone = 'container', ...props }: TileProps) {
  const sxList = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Paper
      elevation={0}
      {...props}
      sx={[
        (theme) => ({
          backdropFilter: 'blur(18px)',
          bgcolor: tone === 'high'
            ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.12)
            : tone === 'sheet'
              ? theme.palette.background.paper
              : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: tone === 'sheet' ? '28px' : '24px',
          boxSizing: 'border-box',
          p: 3,
        }),
        ...sxList,
      ]}
    />
  );
}
