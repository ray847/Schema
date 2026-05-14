import type { ReactNode } from 'react';
import { Paper, Tab, Tabs } from '@mui/material';
import { alpha } from '@mui/material/styles';

export type NavBarSide = 'top' | 'bottom' | 'left' | 'right';
export const NAV_BAR_EDGE_SIZE = 96;

export interface NavBarItem<T extends string> {
  key: T;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface NavBarProps<T extends string> {
  activeKey?: T;
  ariaLabel?: string;
  className?: string;
  items: NavBarItem<T>[];
  onChange: (key: T) => void;
  side?: NavBarSide;
}

export function NavBar<T extends string>({
  activeKey,
  ariaLabel = 'Navigation',
  className,
  items,
  onChange,
  side = 'top',
}: NavBarProps<T>) {
  const vertical = side === 'left' || side === 'right';
  const edgePosition = {
    bottom: side === 'bottom' ? 0 : 'auto',
    left: side === 'right' ? 'auto' : 0,
    right: side === 'left' ? 'auto' : 0,
    top: side === 'bottom' ? 'auto' : 0,
  };

  return (
    <Paper
      className={className}
      component="nav"
      elevation={0}
      square
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
        border: 0,
        bottom: edgePosition.bottom,
        left: edgePosition.left,
        position: 'fixed',
        right: edgePosition.right,
        top: edgePosition.top,
        height: vertical ? '100vh' : NAV_BAR_EDGE_SIZE,
        width: vertical ? NAV_BAR_EDGE_SIZE : '100vw',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
      aria-label={ariaLabel}
    >
      <Tabs
        allowScrollButtonsMobile
        aria-label={ariaLabel}
        onChange={(_event, value: T) => onChange(value)}
        orientation={vertical ? 'vertical' : 'horizontal'}
        scrollButtons={vertical ? 'auto' : false}
        sx={{
          minHeight: vertical ? '100vh' : NAV_BAR_EDGE_SIZE,
          '& .MuiTabs-flexContainer': {
            alignItems: vertical ? 'stretch' : 'center',
            gap: vertical ? 1 : 0.5,
            p: vertical ? 1 : 0.75,
            width: vertical ? 'auto' : '100%',
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTab-root': {
            borderRadius: 999,
            color: 'text.secondary',
            flex: vertical ? '0 0 auto' : '1 1 0',
            fontWeight: 700,
            minHeight: vertical ? 74 : 78,
            minWidth: vertical ? NAV_BAR_EDGE_SIZE - 16 : 0,
            px: 1,
            transition: 'background-color 180ms ease, color 180ms ease',
            '&.Mui-selected': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.14),
              color: 'primary.main',
            },
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.08),
            },
          },
        }}
        value={activeKey ?? false}
        variant={vertical ? 'scrollable' : 'fullWidth'}
      >
        {items.map((item) => {
          const label = item.label ?? (item.icon ? undefined : item.key);

          return (
            <Tab
              disabled={item.disabled}
              icon={item.icon as any}
              iconPosition="top"
              key={item.key}
              label={label as any}
              value={item.key}
            />
          );
        })}
      </Tabs>
    </Paper>
  );
}
