import { RoomType, Time } from "../shared";

export interface TimeLimit {
  st: Time;
  ed: Time;
}
export class TimeConstraint {
  limit: TimeLimit = { st: 0, ed: 24 * 60 };
  duration!: Time;
};

export class PriorityConstraint {
  priority!: number;
};

export class RoomTypePosConstraint {
  types!: RoomType[]
};
export class RoomTypeNegConstraint {
  types!: RoomType[]
};
export type RoomTypeConstraint = RoomTypePosConstraint
  | RoomTypeNegConstraint;

export class FacilityConstraint {
  power_outlet?: number;
};

export class Constraint {
  time!: TimeConstraint;
  priority?: PriorityConstraint;
  roomType?: RoomTypeConstraint;
  facility?: FacilityConstraint;
};