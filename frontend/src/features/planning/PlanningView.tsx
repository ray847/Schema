import { useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
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
import type { PreferenceModel, RoomModel, RoomType } from '../../shared';
import {
  Constraint,
  RoomTypeNegConstraint,
  RoomTypePosConstraint,
  Task,
  solve,
  type Solution,
} from '../../domain';
import { useAuth } from '../authentication';

const LIST_PLANNING_ROOMS = gql`
  query ListPlanningRooms {
    listRoom {
      key
      name
      roomType
      capacity
      facility
      buildingKey
      building {
        key
        name
        campusKey
      }
    }
  }
`;

const LIST_PLANNING_PREFERENCE = gql`
  query ListPlanningPreference($userKey: ID!) {
    listPreference(userKey: $userKey) {
      key
      roomKey
      buildingKey
      campusKey
      value
    }
  }
`;

const ROOM_TYPES: RoomType[] = [
  'AUDITORIUM',
  'LABORATORY',
  'LECTURE',
  'OFFICE',
  'OTHER',
] as RoomType[];

type RoomTypeMode = 'any' | 'include' | 'exclude';

interface TaskDraft {
  id: string;
  name: string;
  start: string;
  end: string;
  duration: number;
  roomTypeMode: RoomTypeMode;
  roomTypes: RoomType[];
}

interface PlanningRoomsData {
  listRoom: RoomModel[];
}

interface PlanningPreferenceData {
  listPreference: PreferenceModel[];
}

interface PlanningPreferenceVars {
  userKey: string;
}

const defaultTask = (index: number): TaskDraft => ({
  id: crypto.randomUUID(),
  name: `Task ${index}`,
  start: '08:00',
  end: '18:00',
  duration: 60,
  roomTypeMode: 'any',
  roomTypes: [],
});

const parseClock = (value: string) => {
  const [hourRaw, minuteRaw] = value.split(':');
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  return hour * 60 + minute;
};

const formatClock = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const buildTask = (draft: TaskDraft) => {
  const task = new Task();
  task.name = draft.name;

  const constraint = new Constraint();
  constraint.time = {
    limit: {
      st: parseClock(draft.start),
      ed: parseClock(draft.end),
    },
    duration: draft.duration,
  };

  if (draft.roomTypeMode === 'include') {
    const roomType = new RoomTypePosConstraint();
    roomType.types = draft.roomTypes;
    constraint.roomType = roomType;
  } else if (draft.roomTypeMode === 'exclude') {
    const roomType = new RoomTypeNegConstraint();
    roomType.types = draft.roomTypes;
    constraint.roomType = roomType;
  }

  task.constraint = constraint;
  return task;
};

const buildAvailability = (tasks: Task[], rooms: RoomModel[]) =>
  tasks.map((task) =>
    rooms.map(() => [
      task.constraint.time.limit.st,
      task.constraint.time.limit.ed,
    ] as [number, number])
  );

export function PlanningView() {
  const { user } = useAuth();
  const [taskDrafts, setTaskDrafts] = useState<TaskDraft[]>([
    defaultTask(1),
    defaultTask(2),
  ]);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [solving, setSolving] = useState(false);

  const roomQuery = useQuery<PlanningRoomsData>(LIST_PLANNING_ROOMS);
  const preferenceQuery = useQuery<PlanningPreferenceData, PlanningPreferenceVars>(
    LIST_PLANNING_PREFERENCE,
    {
      variables: { userKey: String(user?.key ?? '') },
      skip: !user,
    },
  );

  const rooms = roomQuery.data?.listRoom ?? [];
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

        {(roomQuery.loading || preferenceQuery.loading || solving) && <LinearProgress />}
        {roomQuery.error && <Alert severity="error">Rooms failed to load: {roomQuery.error.message}</Alert>}
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
            disabled={roomQuery.loading || solving}
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
