import { useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RouteIcon from '@mui/icons-material/Route';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  solve,
  type Solution,
} from '../domain';
import { useAuth } from '../features/authentication';
import {
  buildAvailability,
  buildTask,
  defaultTask,
  formatClock,
  ROOM_TYPES,
  type RoomTypeMode,
  type TaskDraft,
  usePlanningData,
} from '../features/planning';
import type { RoomType } from '../shared';

export function PlanPage() {
  const { user } = useAuth();
  const [taskDrafts, setTaskDrafts] = useState<TaskDraft[]>([
    defaultTask(1),
    defaultTask(2),
  ]);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [solving, setSolving] = useState(false);

  const { roomQuery, buildingEdgeQuery, preferenceQuery } = usePlanningData(
    user?.key,
  );

  const rooms = roomQuery.data?.listRoom ?? [];
  const buildingEdges = buildingEdgeQuery.data?.listBuildingEdge ?? [];
  const preferences = preferenceQuery.data?.listPreference ?? [];
  const taskRooms = useMemo(
    () => taskDrafts.map(() => rooms),
    [rooms, taskDrafts],
  );

  const selectedRooms = useMemo(() => {
    if (!solution) return [];
    return solution.route.map((roomIdx, stepIdx) => {
      const taskIdx = solution.taskSeq[stepIdx];
      return {
        room: taskRooms[taskIdx]?.[roomIdx],
        start: solution.startTimes[stepIdx],
        task: taskDrafts[taskIdx],
      };
    });
  }, [solution, taskDrafts, taskRooms]);

  const updateTask = (id: string, patch: Partial<TaskDraft>) => {
    setTaskDrafts((tasks) =>
      tasks.map((task) => task.id === id ? { ...task, ...patch } : task)
    );
    setSolution(null);
    setSolveError(null);
  };

  const addTask = () => {
    setTaskDrafts((tasks) => [...tasks, defaultTask(tasks.length + 1)]);
    setSolution(null);
  };

  const removeTask = (id: string) => {
    setTaskDrafts((tasks) => tasks.filter((task) => task.id !== id));
    setSolution(null);
  };

  const runSolver = async () => {
    setSolving(true);
    setSolveError(null);
    setSolution(null);

    try {
      if (rooms.length === 0) {
        throw new Error('No rooms are loaded.');
      }

      const tasks = taskDrafts.map(buildTask);
      for (const task of tasks) {
        if (task.constraint.time.duration <= 0) {
          throw new Error('Task duration must be positive.');
        }
        if (task.constraint.time.limit.ed <= task.constraint.time.limit.st) {
          throw new Error('Task end time must be later than start time.');
        }
      }

      const result = await solve(
        tasks,
        taskRooms,
        buildAvailability(tasks, rooms),
        preferences,
        buildingEdges,
      );

      if (!result) {
        setSolveError('No feasible route found for the current task windows.');
      } else {
        setSolution(result);
      }
    } catch (error) {
      setSolveError(error instanceof Error ? error.message : 'Failed to solve route.');
    } finally {
      setSolving(false);
    }
  };

  return (
    <Paper component="section" elevation={0} sx={{ border: 1, borderColor: 'divider', p: 3 }} aria-labelledby="planning-title">
      <Stack spacing={3}>
        <Box>
          <Typography color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }} variant="overline">
            Planning Query
          </Typography>
          <Typography id="planning-title" variant="h5">
            Planning
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            Define task time windows and room type constraints, then solve for the
            best room route using loaded room data and your preferences.
          </Typography>
        </Box>

        {(roomQuery.loading || buildingEdgeQuery.loading || preferenceQuery.loading || solving) && <LinearProgress />}
        {roomQuery.error && <Alert severity="error">Rooms failed to load: {roomQuery.error.message}</Alert>}
        {buildingEdgeQuery.error && <Alert severity="error">Building graph failed to load: {buildingEdgeQuery.error.message}</Alert>}
        {preferenceQuery.error && <Alert severity="warning">Preferences failed to load: {preferenceQuery.error.message}</Alert>}
        {solveError && <Alert severity="warning">{solveError}</Alert>}

        <Stack spacing={2}>
          {taskDrafts.map((task, index) => (
            <Paper key={task.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
                  <Chip label={index + 1} />
                  <TextField
                    label="Task"
                    onChange={(event) => updateTask(task.id, { name: event.target.value })}
                    size="small"
                    value={task.name}
                  />
                  <TextField
                    label="Earliest start"
                    onChange={(event) => updateTask(task.id, { start: event.target.value })}
                    size="small"
                    type="time"
                    value={task.start}
                  />
                  <TextField
                    label="Latest end"
                    onChange={(event) => updateTask(task.id, { end: event.target.value })}
                    size="small"
                    type="time"
                    value={task.end}
                  />
                  <TextField
                    label="Duration (min)"
                    onChange={(event) => updateTask(task.id, { duration: Number(event.target.value) })}
                    size="small"
                    slotProps={{ htmlInput: { min: 1 } }}
                    type="number"
                    value={task.duration}
                  />
                  <IconButton
                    aria-label={`Remove ${task.name}`}
                    disabled={taskDrafts.length <= 1}
                    onClick={() => removeTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Room type rule</InputLabel>
                    <Select
                      label="Room type rule"
                      onChange={(event) => updateTask(task.id, { roomTypeMode: event.target.value as RoomTypeMode })}
                      value={task.roomTypeMode}
                    >
                      <MenuItem value="any">Any type</MenuItem>
                      <MenuItem value="include">Require types</MenuItem>
                      <MenuItem value="exclude">Avoid types</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl disabled={task.roomTypeMode === 'any'} size="small" sx={{ minWidth: 260 }}>
                    <InputLabel>Room types</InputLabel>
                    <Select
                      label="Room types"
                      multiple
                      onChange={(event) => updateTask(task.id, { roomTypes: event.target.value as RoomType[] })}
                      value={task.roomTypes}
                    >
                      {ROOM_TYPES.map((roomType) => (
                        <MenuItem key={roomType} value={roomType}>
                          {roomType.toLowerCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button onClick={addTask} startIcon={<AddIcon />} variant="outlined">
            Add task
          </Button>
          <Button
            disabled={roomQuery.loading || buildingEdgeQuery.loading || solving}
            onClick={runSolver}
            startIcon={<RouteIcon />}
            variant="contained"
          >
            Solve route
          </Button>
        </Stack>

        {solution && (
          <>
            <Divider />
            <Stack spacing={1.5}>
              <Typography variant="h6">Best route</Typography>
              <Typography color="text.secondary" variant="body2">
                Score: {solution.score.toFixed(2)}
              </Typography>
              {selectedRooms.map(({ room, start, task }, index) => (
                <Paper key={`${task.id}-${room?.key ?? index}`} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1">{task.name}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {formatClock(start)} - {formatClock(start + task.duration)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">{room?.name ?? 'Unknown room'}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {room?.building?.name ?? 'Unknown building'} · {room?.roomType?.toLowerCase?.() ?? 'room'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
