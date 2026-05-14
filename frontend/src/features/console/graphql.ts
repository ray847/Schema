import { gql } from '@apollo/client';

export const LIST_CAMPUS = gql`
  query ListCampus {
    listCampus {
      key
      name
      address
    }
  }
`;

export const CREATE_CAMPUS = gql`
  mutation CreateCampus($inputs: [CampusInput!]!) {
    createCampus(inputs: $inputs)
  }
`;

export const DELETE_CAMPUS = gql`
  mutation DeleteCampus($key: ID!) {
    deleteCampus(key: $key)
  }
`;

export const UPDATE_CAMPUS = gql`
  mutation UpdateCampus($key: ID!, $replacements: JSON!) {
    updateCampus(key: $key, replacements: $replacements)
  }
`;

export const LIST_BUILDING = gql`
  query ListBuilding {
    listBuilding {
      key
      name
      buildingType
      location
      campus {
        key
        name
      }
      metadata {
        key
        relativeX
        relativeY
        width
        depth
        height
        rotation
      }
    }
  }
`;

export const CREATE_BUILDING = gql`
  mutation CreateBuilding($inputs: [BuildingInput!]!) {
    createBuilding(inputs: $inputs)
  }
`;

export const DELETE_BUILDING = gql`
  mutation DeleteBuilding($key: ID!) {
    deleteBuilding(key: $key)
  }
`;

export const UPDATE_BUILDING = gql`
  mutation UpdateBuilding($key: ID!, $replacements: JSON!) {
    updateBuilding(key: $key, replacements: $replacements)
  }
`;

export const LIST_BUILDING_METADATA = gql`
  query ListBuildingMetadata {
    listBuildingMetadata {
      key
      buildingKey
      relativeX
      relativeY
      width
      depth
      height
      rotation
      building {
        key
        name
      }
    }
  }
`;

export const CREATE_BUILDING_METADATA = gql`
  mutation CreateBuildingMetadata($inputs: [BuildingMetadataInput!]!) {
    createBuildingMetadata(inputs: $inputs)
  }
`;

export const DELETE_BUILDING_METADATA = gql`
  mutation DeleteBuildingMetadata($key: ID!) {
    deleteBuildingMetadata(key: $key)
  }
`;

export const UPDATE_BUILDING_METADATA = gql`
  mutation UpdateBuildingMetadata($key: ID!, $replacements: JSON!) {
    updateBuildingMetadata(key: $key, replacements: $replacements)
  }
`;

export const LIST_BUILDING_EDGE = gql`
  query ListBuildingEdge {
    listBuildingEdge {
      key
      fromBuildingKey
      toBuildingKey
      walkTimeSeconds
      distanceMeters
      edgeType
      bidirectional
      fromBuilding {
        key
        name
      }
      toBuilding {
        key
        name
      }
    }
  }
`;

export const CREATE_BUILDING_EDGE = gql`
  mutation CreateBuildingEdge($inputs: [BuildingEdgeInput!]!) {
    createBuildingEdge(inputs: $inputs)
  }
`;

export const DELETE_BUILDING_EDGE = gql`
  mutation DeleteBuildingEdge($key: ID!) {
    deleteBuildingEdge(key: $key)
  }
`;

export const UPDATE_BUILDING_EDGE = gql`
  mutation UpdateBuildingEdge($key: ID!, $replacements: JSON!) {
    updateBuildingEdge(key: $key, replacements: $replacements)
  }
`;

export const LIST_ROOM = gql`
  query ListRoom {
    listRoom {
      key
      name
      roomType
      capacity
      floor
      facility
      building {
        key
        name
      }
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($inputs: [RoomInput!]!) {
    createRoom(inputs: $inputs)
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($key: ID!) {
    deleteRoom(key: $key)
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($key: ID!, $replacements: JSON!) {
    updateRoom(key: $key, replacements: $replacements)
  }
`;

export const LIST_PERSON = gql`
  query ListPerson {
    listPerson {
      key
      personCode
      name
      role
    }
  }
`;

export const CREATE_PERSON = gql`
  mutation CreatePerson($inputs: [PersonInput!]!) {
    createPerson(inputs: $inputs)
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($key: ID!) {
    deletePerson(key: $key)
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($key: ID!, $replacements: JSON!) {
    updatePerson(key: $key, replacements: $replacements)
  }
`;

export const LIST_COURSE = gql`
  query ListCourse {
    listCourse {
      key
      courseCode
      name
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($inputs: [CourseInput!]!) {
    createCourse(inputs: $inputs)
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($key: ID!) {
    deleteCourse(key: $key)
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($key: ID!, $replacements: JSON!) {
    updateCourse(key: $key, replacements: $replacements)
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($inputs: [ActivityInput!]!) {
    createActivity(inputs: $inputs)
  }
`;

export const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($key: ID!) {
    deleteActivity(key: $key)
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($key: ID!, $replacements: JSON!) {
    updateActivity(key: $key, replacements: $replacements)
  }
`;

export const CREATE_COURSE_TEACHER = gql`
  mutation CreateCourseTeacher($inputs: [CourseTeacherInput!]!) {
    createCourseTeacher(inputs: $inputs)
  }
`;

export const DELETE_COURSE_TEACHER = gql`
  mutation DeleteCourseTeacher($courseKey: ID!, $personKey: ID!) {
    deleteCourseTeacher(courseKey: $courseKey, personKey: $personKey)
  }
`;

export const UPDATE_COURSE_TEACHER = gql`
  mutation UpdateCourseTeacher($courseKey: ID!, $personKey: ID!, $replacements: JSON!) {
    updateCourseTeacher(courseKey: $courseKey, personKey: $personKey, replacements: $replacements)
  }
`;

export const CREATE_ALLOCATION = gql`
  mutation CreateAllocation($inputs: [AllocationInput!]!) {
    createAllocation(inputs: $inputs)
  }
`;

export const DELETE_ALLOCATION = gql`
  mutation DeleteAllocation($key: ID!) {
    deleteAllocation(key: $key)
  }
`;

export const UPDATE_ALLOCATION = gql`
  mutation UpdateAllocation($key: ID!, $replacements: JSON!) {
    updateAllocation(key: $key, replacements: $replacements)
  }
`;

export const LIST_ACTIVITY = gql`
  query ListActivity {
    listActivity {
      key
      name
      person {
        key
        name
      }
    }
  }
`;

export const LIST_COURSE_TEACHER = gql`
  query ListCourseTeacher {
    listCourseTeacher {
      personKey
      courseKey
      responsibility
      person {
        key
        name
      }
      course {
        key
        name
      }
    }
  }
`;

export const LIST_ALLOCATION = gql`
  query ListAllocation {
    listAllocation {
      key
      eventType
      eventKey
      startTime
      endTime
      room {
        key
        name
        building {
          key
          name
        }
        floor
      }
    }
  }
`;

export const LIST_PREFERENCE = gql`
  query ListPreference($userKey: ID!) {
    listPreference(userKey: $userKey) {
      key
      roomKey
      buildingKey
      campusKey
      value
    }
  }
`;

export const CREATE_PREFERENCE = gql`
  mutation CreatePreference($userKey: ID!, $input: PreferenceInput!) {
    createPreference(userKey: $userKey, input: $input)
  }
`;

export const DELETE_PREFERENCE = gql`
  mutation DeletePreference($userKey: ID!, $preferenceKey: ID!) {
    deletePreference(userKey: $userKey, preferenceKey: $preferenceKey)
  }
`;

export const UPDATE_PREFERENCE = gql`
  mutation UpdatePreference($userKey: ID!, $preferenceKey: ID!, $input: PreferenceInput!) {
    updatePreference(userKey: $userKey, preferenceKey: $preferenceKey, input: $input)
  }
`;
