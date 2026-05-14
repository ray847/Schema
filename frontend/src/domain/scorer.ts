import { BuildingEdgeModel, PreferenceModel, RoomModel } from "../shared";
import {
  Constraint,
  RoomTypeNegConstraint,
  RoomTypePosConstraint,
} from "./constraint";

export type Score = number;

export interface RoomScoreComponents {
  facility: Score;
  preference: Score;
  roomType: Score;
}

export class Scorer {
  readonly graph: number[][];
  readonly buildingKeyToIndex: Map<string, number>;
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
  readonly floorTravelSeconds = 30;
  preferences!: PreferenceModel[];

  constructor(
    preferences: PreferenceModel[],
    buildingEdges: BuildingEdgeModel[] = [],
  ) {
    this.preferences = preferences;
    const { graph, buildingKeyToIndex } = this.buildDistanceGraph(buildingEdges);
    this.graph = graph;
    this.buildingKeyToIndex = buildingKeyToIndex;
  }

  scoreRoom(room: RoomModel, constraint: Constraint): Score {
    const components = this.scoreRoomComponents(room, constraint);
    return components.roomType + components.preference + components.facility;
  }

  scoreRoomComponents(room: RoomModel, constraint: Constraint): RoomScoreComponents {
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

    const facilityScore = this.scoreFacility(room, constraint);

    return {
      facility: this.weights.facility * facilityScore,
      preference: this.weights.preference * preferenceScore,
      roomType: this.weights.type * roomTypeScore,
    };
  }

  private scoreFacility(room: RoomModel, constraint: Constraint): Score {
    const requiredPowerOutlets = constraint.facility?.power_outlet ?? 0;
    const roomPowerOutlets = this.numericFacilityValue(
      room.facility,
      "power_outlet",
    );

    return requiredPowerOutlets * roomPowerOutlets;
  }

  private numericFacilityValue(
    facility: RoomModel["facility"],
    key: string,
  ): number {
    if (facility == null || typeof facility !== "object") return 0;

    const value = (facility as Record<string, unknown>)[key];
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  scoreTravel(room1: RoomModel, room2: RoomModel): Score {
    const travelSeconds = this.travelSecondsBetweenRooms(room1, room2);

    if (!Number.isFinite(travelSeconds)) return Number.NEGATIVE_INFINITY;
    return -travelSeconds / 60;
  }

  travelSecondsBetweenRooms(room1: RoomModel, room2: RoomModel): number {
    const buildingTravelSeconds = this.travelSeconds(
      room1.buildingKey,
      room2.buildingKey,
    );
    return buildingTravelSeconds + this.floorTransitionSeconds(room1, room2);
  }

  scoreRoute(roomScore: Score, travelScore: Score): Score {
    return this.weights.room * roomScore + this.weights.travel * travelScore;
  }

  private travelSeconds(fromBuildingKey: string, toBuildingKey: string): number {
    if (String(fromBuildingKey) === String(toBuildingKey)) return 0;

    const fromIdx = this.buildingKeyToIndex.get(String(fromBuildingKey));
    const toIdx = this.buildingKeyToIndex.get(String(toBuildingKey));
    if (fromIdx == null || toIdx == null) return Number.POSITIVE_INFINITY;

    return this.graph[fromIdx][toIdx];
  }

  private floorTransitionSeconds(room1: RoomModel, room2: RoomModel): number {
    const floor1 = room1.floor ?? 1;
    const floor2 = room2.floor ?? 1;
    const floorDelta = String(room1.buildingKey) === String(room2.buildingKey)
      ? Math.abs(floor1 - floor2)
      : Math.abs(floor1 - 1) + Math.abs(floor2 - 1);

    return floorDelta * this.floorTravelSeconds;
  }

  private buildDistanceGraph(
    buildingEdges: BuildingEdgeModel[],
  ): {
    graph: number[][];
    buildingKeyToIndex: Map<string, number>;
  } {
    const buildingKeyToIndex = new Map<string, number>();

    const ensureNode = (key: string) => {
      if (!buildingKeyToIndex.has(key)) {
        buildingKeyToIndex.set(key, buildingKeyToIndex.size);
      }
    };

    for (const edge of buildingEdges) {
      ensureNode(String(edge.fromBuildingKey));
      ensureNode(String(edge.toBuildingKey));
    }

    const graph = Array.from(
      { length: buildingKeyToIndex.size },
      (_, row) => Array.from(
        { length: buildingKeyToIndex.size },
        (_, col) => row === col ? 0 : Number.POSITIVE_INFINITY,
      ),
    );

    const setDistance = (from: string, to: string, distance: number) => {
      const fromIdx = buildingKeyToIndex.get(from);
      const toIdx = buildingKeyToIndex.get(to);
      if (fromIdx == null || toIdx == null) return;
      if (distance < graph[fromIdx][toIdx]) graph[fromIdx][toIdx] = distance;
    };

    for (const edge of buildingEdges) {
      const from = String(edge.fromBuildingKey);
      const to = String(edge.toBuildingKey);
      const walkTime = edge.walkTimeSeconds;
      setDistance(from, to, walkTime);
      if (edge.bidirectional) setDistance(to, from, walkTime);
    }

    this.runFloydWarshall(graph);
    return { graph, buildingKeyToIndex };
  }

  private runFloydWarshall(graph: number[][]) {
    for (let via = 0; via < graph.length; via++) {
      for (let from = 0; from < graph.length; from++) {
        const fromVia = graph[from][via];
        if (!Number.isFinite(fromVia)) continue;

        for (let to = 0; to < graph.length; to++) {
          const viaTo = graph[via][to];
          if (!Number.isFinite(viaTo)) continue;

          const candidate = fromVia + viaTo;
          if (candidate < graph[from][to]) {
            graph[from][to] = candidate;
          }
        }
      }
    }
  }

};
