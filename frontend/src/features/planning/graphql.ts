import { gql } from '@apollo/client';

export const LIST_PLANNING_ROOMS = gql`
  query ListPlanningRooms {
    listRoom {
      key
      name
      roomType
      capacity
      floor
      facility
      buildingKey
      building {
        key
        name
        campusKey
      }
    }
  }
`;

export const LIST_PLANNING_PREFERENCE = gql`
  query ListPlanningPreference($userKey: ID!) {
    listPreference(userKey: $userKey) {
      key
      roomKey
      buildingKey
      campusKey
      value
    }
  }
`;

export const LIST_PLANNING_BUILDING_EDGE = gql`
  query ListPlanningBuildingEdge {
    listBuildingEdge {
      key
      fromBuildingKey
      toBuildingKey
      walkTimeSeconds
      bidirectional
    }
  }
`;
