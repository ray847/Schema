import { useState } from 'react';
import ArrowOutward from '@mui/icons-material/ArrowOutward'
import Face from '@mui/icons-material/Face'
import Dashboard from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings';
import { Alert, Box, Container, Typography, useMediaQuery } from '@mui/material';
import { CampusBackground } from './components/CampusBackground';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NavBar, NAV_BAR_EDGE_SIZE, type NavBarItem } from './components/NavBar';
import { useAuth } from './features/authentication';
import {
  defaultTask,
  type TaskDraft,
  usePlanningCampuses,
} from './features/planning';
import type { Solution } from './domain';
import {
  ConsolePage,
  LoginPage,
  PlanPage,
  SettingsPage,
  UserPage,
} from './pages';
import './App.css';

type AppPage = 'plan' | 'console' | 'user' | 'settings';
type NavPage = AppPage;
type PlanningMode = 'input' | 'route';

const pageOptions: NavBarItem<NavPage>[] = [
  { key: 'plan', label: 'Plan', icon: <ArrowOutward /> },
  { key: 'console', label: 'Console', icon: <Dashboard /> },
  { key: 'user', label: 'User', icon: <Face /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

interface AppProps {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

function App({ accentColor, onAccentColorChange }: AppProps) {
  const phonePortrait = useMediaQuery('(max-width: 600px) and (orientation: portrait)');
  const { user, loading } = useAuth();
  const campusQuery = usePlanningCampuses();
  const [activePage, setActivePage] = useState<AppPage>('plan');
  const [selectedCampusKey, setSelectedCampusKey] = useState<string | null>(null);
  const [routeBuildingKeys, setRouteBuildingKeys] = useState<string[]>([]);
  const [planningMode, setPlanningMode] = useState<PlanningMode>('input');
  const [planningSolution, setPlanningSolution] = useState<Solution | null>(null);
  const [planningTaskDrafts, setPlanningTaskDrafts] = useState<TaskDraft[]>([
    defaultTask(1),
    defaultTask(2),
  ]);
  const campuses = campusQuery.data?.listCampus ?? [];
  const selectedCampus =
    campuses.find((campus) => campus.key === selectedCampusKey) ??
    campuses[0] ??
    null;
  const activeCampusKey = selectedCampus?.key ?? selectedCampusKey;
  const backgroundAlign =
    !phonePortrait && (activePage === 'plan' || (activePage === 'user' && !user))
      ? 'right'
      : 'center';
  const bottomPanelPage = activePage === 'plan' || (activePage === 'user' && !user);
  const orientationPortrait = useMediaQuery('(orientation: portrait)');
  const focusTop = orientationPortrait && (activePage === 'plan' || (activePage === 'user' && !user));

  if (loading) {
    return (
      <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100svh', p: 3 }}>
        <Typography color="text.secondary">Loading account...</Typography>
      </Box>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'plan':
        return (
          <PlanPage
            mode={planningMode}
            taskDrafts={planningTaskDrafts}
            solution={planningSolution}
            selectedCampusKey={activeCampusKey}
            onCampusChange={setSelectedCampusKey}
            onModeChange={setPlanningMode}
            onRouteBuildingKeysChange={setRouteBuildingKeys}
            onSolutionChange={setPlanningSolution}
            onTaskDraftsChange={setPlanningTaskDrafts}
          />
        );
      case 'console':
        return <ConsolePage currentUser={user} />;
      case 'user':
        return user ? <UserPage currentUser={user} /> : <LoginPage />;
      case 'settings':
        return (
          <SettingsPage
            accentColor={accentColor}
            onAccentColorChange={onAccentColorChange}
          />
        );
    }
  };

  return (
    <>
      <ErrorBoundary>
        <CampusBackground
          align={backgroundAlign}
          campus={selectedCampus}
          focus={focusTop ? 'top' : 'center'}
          highlightColor={accentColor}
          highlightedBuildingKeys={routeBuildingKeys}
        />
      </ErrorBoundary>
      <NavBar
        activeKey={activePage}
        ariaLabel="Application pages"
        items={pageOptions}
        onChange={(page) => setActivePage(page)}
        side={phonePortrait ? 'bottom' : 'left'}
      />

      <Box
        component="main"
        sx={{
          ml: phonePortrait ? 0 : `${NAV_BAR_EDGE_SIZE}px`,
          minWidth: 0,
          minHeight: '100svh',
          pb: phonePortrait ? `${NAV_BAR_EDGE_SIZE}px` : 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: phonePortrait && bottomPanelPage ? 'flex' : 'block',
            minHeight: phonePortrait ? `calc(100svh - ${NAV_BAR_EDGE_SIZE}px)` : 'auto',
            alignItems: phonePortrait && bottomPanelPage ? 'flex-end' : undefined,
            px: phonePortrait && bottomPanelPage ? 0 : { xs: 2, sm: 3 },
            py: phonePortrait && bottomPanelPage ? 0 : { xs: 3, md: 5 },
          }}
        >
          <ErrorBoundary fallback={<Alert severity="error">This page failed to render. Check the browser console for details.</Alert>}>
            {renderPage()}
          </ErrorBoundary>
        </Container>
      </Box>
    </>
  );
}

export default App;
