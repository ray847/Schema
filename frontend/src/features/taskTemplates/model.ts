import type { RoomType } from '../../shared';

export type TaskTemplateRoomTypeMode = 'any' | 'include' | 'exclude';

export const TASK_TEMPLATE_ROOM_TYPES: RoomType[] = [
  'AUDITORIUM',
  'LABORATORY',
  'LECTURE',
  'OFFICE',
  'OTHER',
] as RoomType[];

export interface TaskTemplateDraft {
  name: string;
  start: string;
  end: string;
  duration: number;
  powerOutletRequirement: number;
  roomTypeMode: TaskTemplateRoomTypeMode;
  roomTypes: RoomType[];
}

export interface TaskTemplate {
  id: string;
  title: string;
  task: TaskTemplateDraft;
}

export interface TaskLikeFromTemplate extends TaskTemplateDraft {
  id: string;
}

export const createTemplateId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const random = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint32Array(2)).join('-')
    : Math.random().toString(36).slice(2);

  return `task-template-${Date.now()}-${random}`;
};

export const defaultTaskTemplateDraft = (index = 1): TaskTemplateDraft => ({
  name: `Task ${index}`,
  start: '08:00',
  end: '18:00',
  duration: 60,
  powerOutletRequirement: 0,
  roomTypeMode: 'any',
  roomTypes: [],
});

export const createTaskTemplate = (
  title: string,
  task: TaskTemplateDraft = defaultTaskTemplateDraft(),
): TaskTemplate => ({
  id: createTemplateId(),
  title,
  task: {
    ...task,
    roomTypes: [...task.roomTypes],
  },
});

export const taskFromTemplateDraft = (
  template: TaskTemplate,
  id: string,
  fallbackIndex: number,
): TaskLikeFromTemplate => ({
  ...template.task,
  id,
  name: template.task.name || `Task ${fallbackIndex}`,
  roomTypes: [...template.task.roomTypes],
});
