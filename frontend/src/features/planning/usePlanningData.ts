import { useQuery } from '@apollo/client/react';
import {
  LIST_PLANNING_BUILDING_EDGE,
  LIST_PLANNING_CAMPUSES,
  LIST_PLANNING_PREFERENCE,
  LIST_PLANNING_ROOMS,
} from './graphql';
import type {
  PlanningBuildingEdgeData,
  PlanningCampusesData,
  PlanningPreferenceData,
  PlanningPreferenceVars,
  PlanningRoomsData,
} from './model';

export function usePlanningCampuses() {
  return useQuery<PlanningCampusesData>(LIST_PLANNING_CAMPUSES);
}

export function usePlanningData(userKey?: string | number | null) {
  const roomQuery = useQuery<PlanningRoomsData>(LIST_PLANNING_ROOMS);
  const campusQuery = usePlanningCampuses();
  const buildingEdgeQuery = useQuery<PlanningBuildingEdgeData>(
    LIST_PLANNING_BUILDING_EDGE,
  );
  const preferenceQuery = useQuery<PlanningPreferenceData, PlanningPreferenceVars>(
    LIST_PLANNING_PREFERENCE,
    {
      variables: { userKey: String(userKey ?? '') },
      skip: !userKey,
    },
  );

  return {
    campusQuery,
    roomQuery,
    buildingEdgeQuery,
    preferenceQuery,
  };
}
