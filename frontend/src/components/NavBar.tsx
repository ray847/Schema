import type { ReactNode } from 'react';
import { Paper, Tab, Tabs } from '@mui/material';

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
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderBottom: side === 'top' ? 1 : 0,
        borderLeft: side === 'right' ? 1 : 0,
        borderRight: side === 'left' ? 1 : 0,
        borderTop: side === 'bottom' ? 1 : 0,
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
        scrollButtons="auto"
        sx={{
          minHeight: vertical ? '100vh' : NAV_BAR_EDGE_SIZE,
          '& .MuiTabs-flexContainer': {
            alignItems: vertical ? 'stretch' : 'center',
          },
          '& .MuiTab-root': {
            minHeight: vertical ? 76 : NAV_BAR_EDGE_SIZE,
            minWidth: vertical ? NAV_BAR_EDGE_SIZE : 90,
            px: 1,
          },
        }}
        value={activeKey ?? false}
        variant="scrollable"
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
