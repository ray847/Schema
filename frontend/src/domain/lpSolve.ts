export interface LpProblemDraft {
  taskId: string;
  objective: string;
  constraints: string[];
}

export interface LpSolutionDraft {
  problemId: string;
  status: 'placeholder';
  routes: string[];
}

export function solveLpProblem(problem: LpProblemDraft): LpSolutionDraft {
  return {
    problemId: problem.taskId,
    status: 'placeholder',
    routes: [],
  };
}
