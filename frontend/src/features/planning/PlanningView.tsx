import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { planningTaskStates, solveLpProblem, type PlanningTask } from '../../domain';

const placeholderTasks: PlanningTask[] = [
  { id: 'task-list', title: 'Task List', status: 'draft' },
  { id: 'problem-definition', title: 'Problem Definition', status: 'ready' },
  { id: 'lp-solving', title: 'LP Problem Solving', status: 'solving' },
  { id: 'routes', title: 'Routes', status: 'solved' },
];

export function PlanningView() {
  const placeholderSolution = solveLpProblem({
    taskId: 'planning-placeholder',
    objective: 'Assign available rooms to requested events.',
    constraints: [],
  });

  return (
    <Paper component="section" elevation={0} sx={{ border: 1, borderColor: 'divider', p: 3 }} aria-labelledby="planning-title">
      <Stack spacing={2.5}>
        <Box>
          <Typography color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }} variant="overline">
            Planning Query
          </Typography>
          <Typography id="planning-title" variant="h5">
            Planning
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            Placeholder flow for task intake, problem definition, LP solving, and
            route selection.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
          }}
        >
          {placeholderTasks.map((task) => (
            <Paper key={task.id} variant="outlined" sx={{ p: 2 }}>
              <Chip label={planningTaskStates.indexOf(task.status) + 1} size="small" sx={{ mb: 1 }} />
              <Typography variant="subtitle1">{task.title}</Typography>
              <Typography color="text.secondary" variant="body2">
                {task.status}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Typography color="text.secondary" variant="body2">
          Solver status: {placeholderSolution.status}. Domain hooks are in place
          for the real LP model.
        </Typography>
      </Stack>
    </Paper>
  );
}
