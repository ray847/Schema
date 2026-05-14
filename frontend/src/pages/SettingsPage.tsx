import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Tile } from '../components/Tile';

interface SettingsPageProps {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
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
      </Stack>
    </Tile>
  );
}
