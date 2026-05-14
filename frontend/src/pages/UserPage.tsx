import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { CurrentUser } from '../api/authentication';
import { Tile } from '../components/Tile';
import { useAuth } from '../features/authentication';
import {
  createTaskTemplate,
  defaultTaskTemplateDraft,
  TASK_TEMPLATE_ROOM_TYPES,
  type TaskTemplate,
  type TaskTemplateRoomTypeMode,
  useTaskTemplates,
} from '../features/taskTemplates';
import type { RoomType } from '../shared';
import { ConsoleView } from './ConsolePage';

interface UserPageProps {
  currentUser: CurrentUser | null;
}

export function UserPage({ currentUser }: UserPageProps) {
  const { signOut } = useAuth();
  const {
    deleteTemplate,
    error: templateError,
    loading: templatesLoading,
    templates,
    upsertTemplate,
  } = useTaskTemplates(currentUser?.key);

  const updateTemplate = (template: TaskTemplate, patch: Partial<TaskTemplate>) => {
    void upsertTemplate({
      ...template,
      ...patch,
      task: {
        ...template.task,
        ...(patch.task ?? {}),
        roomTypes: [...(patch.task?.roomTypes ?? template.task.roomTypes)],
      },
    });
  };

  const addTemplate = () => {
    void upsertTemplate(
      createTaskTemplate(
        `Template ${templates.length + 1}`,
        defaultTaskTemplateDraft(templates.length + 1),
      ),
    );
  };

  return (
    <Tile component="section" aria-labelledby="preference-title">
      <Stack spacing={2}>
        <Box>
          <Typography color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }} variant="overline">
            Preference View
          </Typography>
          <Typography id="preference-title" variant="h5">
            Preferences
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            Manage your personal room, building, and campus preference weights.
          </Typography>
        </Box>
        {currentUser ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Alert severity="info" sx={{ flex: 1 }}>
              Signed in as {currentUser.email}.
            </Alert>
            <Button onClick={signOut} variant="outlined">
              Sign out
            </Button>
          </Stack>
        ) : (
          <Alert severity="warning">
            Sign in before editing personal room, building, or campus weights.
          </Alert>
        )}
        {currentUser && (
          <>
            <Divider />
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Task templates</Typography>
                <Typography color="text.secondary" variant="body2">
                  Save reusable task defaults for the planning page.
                </Typography>
              </Box>
              {templateError && <Alert severity="error">{templateError}</Alert>}
              {templatesLoading && <Alert severity="info">Loading task templates...</Alert>}
              {templates.map((template) => (
                <Paper key={template.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
                      <TextField
                        label="Template"
                        onChange={(event) => updateTemplate(template, { title: event.target.value })}
                        size="small"
                        sx={{ flex: '1 1 180px' }}
                        value={template.title}
                      />
                      <TextField
                        label="Task"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, name: event.target.value } })}
                        size="small"
                        sx={{ flex: '1 1 180px' }}
                        value={template.task.name}
                      />
                      <TextField
                        label="Earliest start"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, start: event.target.value } })}
                        size="small"
                        sx={{ flex: '1 1 140px' }}
                        type="time"
                        value={template.task.start}
                      />
                      <TextField
                        label="Latest end"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, end: event.target.value } })}
                        size="small"
                        sx={{ flex: '1 1 140px' }}
                        type="time"
                        value={template.task.end}
                      />
                      <TextField
                        label="Duration (min)"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, duration: Number(event.target.value) } })}
                        size="small"
                        slotProps={{ htmlInput: { min: 1 } }}
                        sx={{ flex: '1 1 140px' }}
                        type="number"
                        value={template.task.duration}
                      />
                      <TextField
                        label="Power outlet weight"
                        onChange={(event) => updateTemplate(template, { task: { ...template.task, powerOutletRequirement: Number(event.target.value) } })}
                        size="small"
                        slotProps={{ htmlInput: { max: 1, min: 0, step: 0.1 } }}
                        sx={{ flex: '1 1 140px' }}
                        type="number"
                        value={template.task.powerOutletRequirement}
                      />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
                      <FormControl size="small" sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <InputLabel>Room type rule</InputLabel>
                        <Select
                          label="Room type rule"
                          onChange={(event) => updateTemplate(template, { task: { ...template.task, roomTypeMode: event.target.value as TaskTemplateRoomTypeMode } })}
                          value={template.task.roomTypeMode}
                        >
                          <MenuItem value="any">Any type</MenuItem>
                          <MenuItem value="include">Require types</MenuItem>
                          <MenuItem value="exclude">Avoid types</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl disabled={template.task.roomTypeMode === 'any'} size="small" sx={{ flex: '2 1 220px', minWidth: 220 }}>
                        <InputLabel>Room types</InputLabel>
                        <Select
                          label="Room types"
                          multiple
                          onChange={(event) => updateTemplate(template, { task: { ...template.task, roomTypes: event.target.value as RoomType[] } })}
                          value={template.task.roomTypes}
                        >
                          {TASK_TEMPLATE_ROOM_TYPES.map((roomType) => (
                            <MenuItem key={roomType} value={roomType}>
                              {roomType.toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button color="error" onClick={() => void deleteTemplate(template.id)} variant="outlined">
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
              <Button onClick={addTemplate} variant="outlined">
                Add template
              </Button>
            </Stack>
          </>
        )}
        {currentUser && <Divider />}
        {currentUser && <ConsoleView currentUser={currentUser} preferenceOnly />}
      </Stack>
    </Tile>
  );
}
