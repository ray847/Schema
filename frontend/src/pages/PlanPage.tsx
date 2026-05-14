import { useEffect, useMemo, useState } from 'react';
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
import type { RoomModel, RoomType } from '../shared';

interface PlanPageProps {
  mode: 'input' | 'route';
  selectedCampusKey: string | null;
  solution: Solution | null;
  taskDrafts: TaskDraft[];
  onCampusChange: (campusKey: string) => void;
  onModeChange: (mode: 'input' | 'route') => void;
  onRouteBuildingKeysChange: (buildingKeys: string[]) => void;
  onSolutionChange: (solution: Solution | null) => void;
  onTaskDraftsChange: (tasks: TaskDraft[]) => void;
}

export function PlanPage({
  mode,
  selectedCampusKey,
  solution,
  taskDrafts,
  onCampusChange,
  onModeChange,
  onRouteBuildingKeysChange,
  onSolutionChange,
  onTaskDraftsChange,
}: PlanPageProps) {
  const { user } = useAuth();
  const [solveError, setSolveError] = useState<string | null>(null);
  const [solving, setSolving] = useState(false);

  const { campusQuery, buildingEdgeQuery, preferenceQuery } = usePlanningData(
    user?.key,
  );

  const campuses = campusQuery.data?.listCampus ?? [];
  const buildingEdges = buildingEdgeQuery.data?.listBuildingEdge ?? [];
  const preferences = preferenceQuery.data?.listPreference ?? [];
  const activeCampusKey = selectedCampusKey ?? campuses[0]?.key ?? '';
  const campusSelectValue = campuses.some((campus) => campus.key === activeCampusKey)
    ? activeCampusKey
    : '';
  const selectedCampus = campuses.find((campus) => campus.key === activeCampusKey);
  const campusRooms = useMemo(
    () => selectedCampus?.buildings.flatMap((building) =>
      building.rooms.map((room) => ({
        ...room,
        building,
      } as RoomModel))
    ) ?? [],
    [selectedCampus],
  );
  const campusBuildingEdges = useMemo(
    () => buildingEdges.filter((edge) =>
      edge.fromBuilding?.campusKey === activeCampusKey &&
      edge.toBuilding?.campusKey === activeCampusKey
    ),
    [activeCampusKey, buildingEdges],
  );
  const taskRooms = useMemo(
    () => taskDrafts.map(() => campusRooms),
    [campusRooms, taskDrafts],
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

  useEffect(() => {
    if (!solution) {
      onRouteBuildingKeysChange([]);
      return;
    }

    onRouteBuildingKeysChange(
      Array.from(new Set(
        selectedRooms
          .map(({ room }) => room?.buildingKey)
          .filter((buildingKey): buildingKey is string => Boolean(buildingKey))
          .map(String),
      )),
    );
  }, [onRouteBuildingKeysChange, selectedRooms, solution]);

  const updateTask = (id: string, patch: Partial<TaskDraft>) => {
    onTaskDraftsChange(
      taskDrafts.map((task) => task.id === id ? { ...task, ...patch } : task)
    );
    onSolutionChange(null);
    onModeChange('input');
    setSolveError(null);
  };

  const addTask = () => {
    onTaskDraftsChange([...taskDrafts, defaultTask(taskDrafts.length + 1)]);
    onSolutionChange(null);
    onModeChange('input');
  };

  const removeTask = (id: string) => {
    onTaskDraftsChange(taskDrafts.filter((task) => task.id !== id));
    onSolutionChange(null);
    onModeChange('input');
  };

  const runSolver = async () => {
    setSolving(true);
    setSolveError(null);
    onSolutionChange(null);

    try {
      if (!activeCampusKey) {
        throw new Error('Select a campus before solving.');
      }
      if (campusRooms.length === 0) {
        throw new Error('No rooms are loaded for the selected campus.');
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
        buildAvailability(tasks, campusRooms),
        preferences,
        campusBuildingEdges,
      );

      if (!result) {
        setSolveError('No feasible route found for the current task windows.');
      } else {
        onSolutionChange(result);
        onModeChange('route');
      }
    } catch (error) {
      setSolveError(error instanceof Error ? error.message : 'Failed to solve route.');
    } finally {
      setSolving(false);
    }
  };

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        boxSizing: 'border-box',
        maxHeight: {
          xs: 'calc(50svh - 8px)',
          sm: 'none',
        },
        overflowY: {
          xs: 'auto',
          sm: 'visible',
        },
        p: 3,
        width: { xs: '100%', md: '50%' },
        '@media (max-width: 600px) and (orientation: portrait)': {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          height: 'calc(50svh - 8px)',
          p: 2,
        },
      }}
      aria-labelledby="planning-title"
    >
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

        <FormControl fullWidth size="small">
          <InputLabel>Campus</InputLabel>
          <Select
            label="Campus"
            onChange={(event) => {
              onCampusChange(event.target.value);
              onRouteBuildingKeysChange([]);
              onSolutionChange(null);
              onModeChange('input');
              setSolveError(null);
            }}
            value={campusSelectValue}
          >
            {campuses.length === 0 && (
              <MenuItem disabled value="">
                No campuses available
              </MenuItem>
            )}
            {campuses.map((campus) => (
              <MenuItem key={campus.key} value={campus.key}>
                {campus.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(campusQuery.loading || buildingEdgeQuery.loading || preferenceQuery.loading || solving) && <LinearProgress />}
        {campusQuery.error && <Alert severity="error">Campuses failed to load: {campusQuery.error.message}</Alert>}
        {buildingEdgeQuery.error && <Alert severity="error">Building graph failed to load: {buildingEdgeQuery.error.message}</Alert>}
        {preferenceQuery.error && <Alert severity="warning">Preferences failed to load: {preferenceQuery.error.message}</Alert>}
        {solveError && <Alert severity="warning">{solveError}</Alert>}

        <Box sx={{ minWidth: 0, width: '100%' }}>
          {mode === 'route' && solution && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">Best route</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Score: {solution?.score.toFixed(2)}
                  </Typography>
                </Box>
                <Button onClick={() => onModeChange('input')} variant="outlined">
                  Edit tasks
                </Button>
              </Stack>
              <Divider />
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
          )}

          <Stack spacing={2} sx={{ display: mode === 'route' && solution ? 'none' : 'flex' }}>
            {taskDrafts.map((task, index) => (
              <Paper key={task.id} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                    useFlexGap
                  >
                    <Chip label={index + 1} />
                    <TextField
                      label="Task"
                      onChange={(event) => updateTask(task.id, { name: event.target.value })}
                      size="small"
                      sx={{ minWidth: 180, flex: '1 1 180px' }}
                      value={task.name}
                    />
                    <TextField
                      label="Earliest start"
                      onChange={(event) => updateTask(task.id, { start: event.target.value })}
                      size="small"
                      sx={{ flex: '1 1 150px' }}
                      type="time"
                      value={task.start}
                    />
                    <TextField
                      label="Latest end"
                      onChange={(event) => updateTask(task.id, { end: event.target.value })}
                      size="small"
                      sx={{ flex: '1 1 150px' }}
                      type="time"
                      value={task.end}
                    />
                    <TextField
                      label="Duration (min)"
                      onChange={(event) => updateTask(task.id, { duration: Number(event.target.value) })}
                      size="small"
                      slotProps={{ htmlInput: { min: 1 } }}
                      sx={{ flex: '1 1 150px' }}
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

                  <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
                    <FormControl size="small" sx={{ flex: '1 1 180px', minWidth: 180 }}>
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
                    <FormControl disabled={task.roomTypeMode === 'any'} size="small" sx={{ flex: '2 1 220px', minWidth: 220 }}>
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

            <Stack direction="row" spacing={1}>
              <Button onClick={addTask} startIcon={<AddIcon />} variant="outlined">
                Add task
              </Button>
              <Button
                disabled={campusQuery.loading || buildingEdgeQuery.loading || solving}
                onClick={runSolver}
                startIcon={<RouteIcon />}
                variant="contained"
              >
                Solve route
              </Button>
              {solution && (
                <Button onClick={() => onModeChange('route')} variant="text">
                  Show route
                </Button>
              )}
            </Stack>
            {false && solution !== null && (
              <>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="h6">Best route</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Score: {solution?.score.toFixed(2)}
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
        </Box>
      </Stack>
    </Paper>
  );
}
