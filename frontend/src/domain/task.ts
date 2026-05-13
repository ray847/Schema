import { Constraint } from "./constraint"

export class Task {
  name!: string
  constraint!: Constraint
};

export type TaskStatus = 'draft' | 'ready' | 'solving' | 'solved';

export interface PlanningTask {
  id: string;
  title: string;
  status: TaskStatus;
}

export const planningTaskStates: TaskStatus[] = [
  'draft',
  'ready',
  'solving',
  'solved',
];
