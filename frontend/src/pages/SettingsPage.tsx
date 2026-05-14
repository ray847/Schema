import {
  Box,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Tile } from '../components/Tile';
import type { ThemeModePreference } from '../theme/materialYouTheme';

interface SettingsPageProps {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  onThemeModeChange: (mode: ThemeModePreference) => void;
  themeMode: ThemeModePreference;
}

const accentPresets = [
  '#2563eb',
  '#7c3aed',
  '#0891b2',
  '#059669',
  '#dc2626',
  '#ea580c',
];

export function SettingsPage({
  accentColor,
  onAccentColorChange,
  onThemeModeChange,
  themeMode,
}: SettingsPageProps) {
  return (
    <Tile component="section" aria-labelledby="settings-title">
      <Stack spacing={3}>
        <Box>
          <Typography color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }} variant="overline">
            Appearance
          </Typography>
          <Typography id="settings-title" variant="h5">
            Settings
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          <Typography variant="subtitle1">Accent color</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
            <TextField
              label="Accent"
              onChange={(event) => onAccentColorChange(event.target.value)}
              size="small"
              slotProps={{ htmlInput: { type: 'color' } }}
              sx={{ width: 120 }}
              value={accentColor}
            />
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {accentPresets.map((color) => (
                <Button
                  aria-label={`Use accent color ${color}`}
                  key={color}
                  onClick={() => onAccentColorChange(color)}
                  sx={{
                    bgcolor: color,
                    border: color === accentColor ? 3 : 1,
                    borderColor: color === accentColor ? 'text.primary' : 'divider',
                    minWidth: 40,
                    p: 0,
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: color,
                      filter: 'brightness(0.95)',
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={1.5}>
          <Box>
            <Typography variant="subtitle1">Theme mode</Typography>
            <Typography color="text.secondary" variant="body2">
              Use a fixed light or dark scheme, or follow the system preference.
            </Typography>
          </Box>
          <ToggleButtonGroup
            exclusive
            onChange={(_event, value: ThemeModePreference | null) => {
              if (value) onThemeModeChange(value);
            }}
            size="small"
            value={themeMode}
          >
            <ToggleButton value="system">System</ToggleButton>
            <ToggleButton value="light">Light</ToggleButton>
            <ToggleButton value="dark">Dark</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Tile>
  );
}
