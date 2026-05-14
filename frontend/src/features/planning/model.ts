import {
  Constraint,
  RoomTypeNegConstraint,
  RoomTypePosConstraint,
  Task,
} from '../../domain';
import type {
  BuildingEdgeModel,
  CampusModel,
  PreferenceModel,
  RoomModel,
  RoomType,
} from '../../shared';

export const ROOM_TYPES: RoomType[] = [
  'AUDITORIUM',
  'LABORATORY',
  'LECTURE',
  'OFFICE',
  'OTHER',
] as RoomType[];

export type RoomTypeMode = 'any' | 'include' | 'exclude';

export interface TaskDraft {
  id: string;
  name: string;
  start: string;
  end: string;
  duration: number;
  roomTypeMode: RoomTypeMode;
  roomTypes: RoomType[];
}

export interface PlanningRoomsData {
  listRoom: RoomModel[];
}

export interface PlanningCampusesData {
  listCampus: CampusModel[];
}

export interface PlanningPreferenceData {
  listPreference: PreferenceModel[];
}

export interface PlanningBuildingEdgeData {
  listBuildingEdge: BuildingEdgeModel[];
}

export interface PlanningPreferenceVars {
  userKey: string;
}

const createTaskId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const random = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint32Array(2)).join('-')
    : Math.random().toString(36).slice(2);

  return `task-${Date.now()}-${random}`;
};

export const defaultTask = (index: number): TaskDraft => ({
  id: createTaskId(),
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

export const formatClock = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const buildTask = (draft: TaskDraft) => {
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

export const buildAvailability = (tasks: Task[], rooms: RoomModel[]) =>
  tasks.map((task) =>
    rooms.map(() => [
      task.constraint.time.limit.st,
      task.constraint.time.limit.ed,
    ] as [number, number])
  );
