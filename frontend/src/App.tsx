import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { NavBar, NAV_BAR_EDGE_SIZE, type NavBarItem } from './components/NavBar';
import { useAuth } from './features/authentication';
import {
  ConsolePage,
  LoginPage,
  PlanPage,
  SettingsPage,
  UserPage,
} from './pages';
import './App.css';

type AppPage = 'plan' | 'console' | 'user' | 'settings' | 'login';
type NavPage = Exclude<AppPage, 'login'>;

const pageOptions: NavBarItem<NavPage>[] = [
  { key: 'plan', label: 'Plan', icon: <MapIcon /> },
  { key: 'console', label: 'Console', icon: <StorageIcon /> },
  { key: 'user', label: 'User', icon: <AccountCircleIcon /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

function App() {
  const { user, loading, signOut } = useAuth();
  const [activePage, setActivePage] = useState<AppPage>('plan');
  const isAdmin = user?.type === 'admin';
  const currentPage = user && activePage === 'login' ? 'plan' : activePage;

  if (loading) {
    return (
      <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100svh', p: 3 }}>
        <Typography color="text.secondary">Loading account...</Typography>
      </Box>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'plan':
        return <PlanPage />;
      case 'console':
        return <ConsolePage currentUser={user} />;
      case 'user':
        return <UserPage currentUser={user} />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage />;
    }
  };

  return (
    <>
      <NavBar
        activeKey={currentPage === 'login' ? undefined : currentPage}
        ariaLabel="Application pages"
        items={pageOptions}
        onChange={(page) => setActivePage(page)}
        side="left"
      />

      <Box
        component="main"
        sx={{
          ml: `${NAV_BAR_EDGE_SIZE}px`,
          width: `calc(100vw - ${NAV_BAR_EDGE_SIZE}px)`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Paper component="header" elevation={0} sx={{ p: 3 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{
                  alignItems: { xs: 'stretch', md: 'center' },
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }} variant="overline">
                    {isAdmin ? 'Admin console' : user ? `${user.type} workspace` : 'Spectate mode'}
                  </Typography>
                  <Typography variant="h3">Space Planning</Typography>
                </Box>

                {user ? (
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography color="text.secondary" variant="body2">
                      {user.email}
                    </Typography>
                    <Chip label={user.type} size="small" />
                    <Button onClick={signOut} variant="outlined">
                      Sign out
                    </Button>
                  </Stack>
                ) : (
                  <Button onClick={() => setActivePage('login')} variant="outlined">
                    Sign in
                  </Button>
                )}
              </Stack>
            </Paper>

            {renderPage()}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default App;
