import { PreferenceModel, RoomModel } from "../shared";
import {
  Constraint,
  RoomTypeNegConstraint,
  RoomTypePosConstraint,
} from "./constraint";

export type Score = number;

export class Scorer {
  readonly weights: {
    type: number,
    preference: number,
    facility: number,
    room: number,
    travel: number,
  } = {
      type: 1.0,
      preference: 1.0,
      facility: 1.0,
      room: 1.0,
      travel: 1.0,
    };
  preferences!: PreferenceModel[];

  constructor(preferences: PreferenceModel[]) {
    this.preferences = preferences;
  }

  scoreRoom(room: RoomModel, constraint: Constraint): Score {
    // Room Type Score
    var roomTypeScore: Score = 0;
    if (constraint.roomType instanceof RoomTypePosConstraint)
      roomTypeScore = Number(constraint.roomType.types.includes(room.roomType));
    else if (constraint.roomType instanceof RoomTypeNegConstraint)
      roomTypeScore = Number(!constraint.roomType.types.includes(room.roomType));

    // Preference Score
    var preferenceScore: Score = 0;
    for (const preference of this.preferences) {
      if (preference.roomKey && preference.roomKey == room.key) {
        preferenceScore = preference.value;
        break;
      } else if (preference.buildingKey
        && preference.buildingKey == room.buildingKey) {
        preferenceScore = preference.value;
      } else if (preference.campusKey
        && preference.campusKey == room.building.campusKey) {
        preferenceScore = preference.value;
      }
    }

    return this.weights.type * roomTypeScore +
      this.weights.preference * preferenceScore;
  }

  scoreTravel(_room1: RoomModel, _room2: RoomModel): Score {
    return 1.0;
  }

  scoreRoute(roomScore: Score, travelScore: Score): Score {
    return this.weights.room * roomScore + this.weights.travel * travelScore;
  }

};
