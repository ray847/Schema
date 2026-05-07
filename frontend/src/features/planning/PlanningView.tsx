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
    <section className="feature-surface" aria-labelledby="planning-title">
      <div className="feature-heading">
        <p className="eyebrow">Planning Query</p>
        <h2 id="planning-title">Planning</h2>
        <p>
          Placeholder flow for task intake, problem definition, LP solving, and
          route selection.
        </p>
      </div>
      <div className="state-grid">
        {placeholderTasks.map((task) => (
          <article className="state-card" key={task.id}>
            <span>{planningTaskStates.indexOf(task.status) + 1}</span>
            <h3>{task.title}</h3>
            <p>{task.status}</p>
          </article>
        ))}
      </div>
      <p className="placeholder-note">
        Solver status: {placeholderSolution.status}. Domain hooks are in place
        for the real LP model.
      </p>
    </section>
  );
}
