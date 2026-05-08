import { RoomType } from "../shared";

export class LpTimeConstraint {
  limit?: { st: Date, ed: Date };
  duration!: Date;
};

export class LpPriorityConstraint {
  priority!: number;
};

export class LpRoomTypePosConstraint {
  types!: RoomType[]
};
export class LpRoomTypeNegConstraint {
  types!: RoomType[]
};
export type LpRoomTypeConstraint = LpRoomTypePosConstraint
  | LpRoomTypeNegConstraint;

export class LpFacilityConstraint {
  power_outlet?: number;
};

export class LpTaskConstraint {
  time?: LpTimeConstraint;
  priority?: LpPriorityConstraint;
  roomType?: LpRoomTypeConstraint;
  facility?: LpFacilityConstraint;
};

export class LpConstraint {
  tasks!: LpTaskConstraint[];
};

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
