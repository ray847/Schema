import { useMutation, useQuery } from '@apollo/client/react';
import {
  CREATE_ACTIVITY,
  CREATE_ALLOCATION,
  CREATE_BUILDING,
  CREATE_BUILDING_EDGE,
  CREATE_BUILDING_METADATA,
  CREATE_CAMPUS,
  CREATE_COURSE,
  CREATE_COURSE_TEACHER,
  CREATE_PERSON,
  CREATE_PREFERENCE,
  CREATE_ROOM,
  DELETE_ACTIVITY,
  DELETE_ALLOCATION,
  DELETE_BUILDING,
  DELETE_BUILDING_EDGE,
  DELETE_BUILDING_METADATA,
  DELETE_CAMPUS,
  DELETE_COURSE,
  DELETE_COURSE_TEACHER,
  DELETE_PERSON,
  DELETE_PREFERENCE,
  DELETE_ROOM,
  LIST_ACTIVITY,
  LIST_ALLOCATION,
  LIST_BUILDING,
  LIST_BUILDING_EDGE,
  LIST_BUILDING_METADATA,
  LIST_CAMPUS,
  LIST_COURSE,
  LIST_COURSE_TEACHER,
  LIST_PERSON,
  LIST_PREFERENCE,
  LIST_ROOM,
  UPDATE_ACTIVITY,
  UPDATE_ALLOCATION,
  UPDATE_BUILDING,
  UPDATE_BUILDING_EDGE,
  UPDATE_BUILDING_METADATA,
  UPDATE_CAMPUS,
  UPDATE_COURSE,
  UPDATE_COURSE_TEACHER,
  UPDATE_PERSON,
  UPDATE_PREFERENCE,
  UPDATE_ROOM,
} from './graphql';
import type {
  ListPreferenceData,
  ListPreferenceVars,
  ModelType,
} from './model';

interface UseConsoleDataOptions {
  currentUserKey: string;
  selectedModel: ModelType;
  selectionModel: ModelType;
}

export function useConsoleData({
  currentUserKey,
  selectedModel,
  selectionModel,
}: UseConsoleDataOptions) {
  const campusQuery = useQuery<any>(LIST_CAMPUS, {
    skip: selectedModel !== 'CAMPUS'
      && selectionModel !== 'CAMPUS'
      && selectedModel !== 'PREFERENCE',
  });
  const buildingQuery = useQuery<any>(LIST_BUILDING, {
    skip: selectedModel !== 'BUILDING'
      && selectedModel !== 'BUILDING_METADATA'
      && selectedModel !== 'BUILDING_EDGE'
      && selectionModel !== 'BUILDING'
      && selectedModel !== 'PREFERENCE',
  });
  const buildingMetadataQuery = useQuery<any>(LIST_BUILDING_METADATA, {
    skip: selectedModel !== 'BUILDING_METADATA',
  });
  const buildingEdgeQuery = useQuery<any>(LIST_BUILDING_EDGE, {
    skip: selectedModel !== 'BUILDING_EDGE',
  });
  const roomQuery = useQuery<any>(LIST_ROOM, {
    skip: selectedModel !== 'ROOM'
      && selectionModel !== 'ROOM'
      && selectedModel !== 'PREFERENCE',
  });
  const personQuery = useQuery<any>(LIST_PERSON, {
    skip: selectedModel !== 'PERSON' && selectionModel !== 'PERSON',
  });
  const courseQuery = useQuery<any>(LIST_COURSE, {
    skip: selectedModel !== 'COURSE'
      && selectionModel !== 'COURSE'
      && selectedModel !== 'ALLOCATION',
  });
  const activityQuery = useQuery<any>(LIST_ACTIVITY, {
    skip: selectedModel !== 'ACTIVITY'
      && selectionModel !== 'ACTIVITY'
      && selectedModel !== 'ALLOCATION',
  });
  const courseTeacherQuery = useQuery<any>(LIST_COURSE_TEACHER, {
    skip: selectedModel !== 'COURSE_TEACHER',
  });
  const allocationQuery = useQuery<any>(LIST_ALLOCATION, {
    skip: selectedModel !== 'ALLOCATION',
  });
  const preferenceQuery = useQuery<ListPreferenceData, ListPreferenceVars>(
    LIST_PREFERENCE,
    {
      variables: { userKey: currentUserKey },
      skip: selectedModel !== 'PREFERENCE' || !currentUserKey,
    },
  );

  const [createCampus] = useMutation(CREATE_CAMPUS, {
    refetchQueries: [{ query: LIST_CAMPUS }],
  });
  const [deleteCampus] = useMutation(DELETE_CAMPUS, {
    refetchQueries: [{ query: LIST_CAMPUS }],
  });
  const [updateCampus] = useMutation(UPDATE_CAMPUS, {
    refetchQueries: [{ query: LIST_CAMPUS }],
  });

  const [createBuilding] = useMutation(CREATE_BUILDING, {
    refetchQueries: [{ query: LIST_BUILDING }],
  });
  const [deleteBuilding] = useMutation(DELETE_BUILDING, {
    refetchQueries: [{ query: LIST_BUILDING }],
  });
  const [updateBuilding] = useMutation(UPDATE_BUILDING, {
    refetchQueries: [{ query: LIST_BUILDING }],
  });

  const [createBuildingMetadata] = useMutation(CREATE_BUILDING_METADATA, {
    refetchQueries: [{ query: LIST_BUILDING_METADATA }],
  });
  const [deleteBuildingMetadata] = useMutation(DELETE_BUILDING_METADATA, {
    refetchQueries: [{ query: LIST_BUILDING_METADATA }],
  });
  const [updateBuildingMetadata] = useMutation(UPDATE_BUILDING_METADATA, {
    refetchQueries: [{ query: LIST_BUILDING_METADATA }],
  });

  const [createBuildingEdge] = useMutation(CREATE_BUILDING_EDGE, {
    refetchQueries: [{ query: LIST_BUILDING_EDGE }],
  });
  const [deleteBuildingEdge] = useMutation(DELETE_BUILDING_EDGE, {
    refetchQueries: [{ query: LIST_BUILDING_EDGE }],
  });
  const [updateBuildingEdge] = useMutation(UPDATE_BUILDING_EDGE, {
    refetchQueries: [{ query: LIST_BUILDING_EDGE }],
  });

  const [createRoom] = useMutation(CREATE_ROOM, {
    refetchQueries: [{ query: LIST_ROOM }],
  });
  const [deleteRoom] = useMutation(DELETE_ROOM, {
    refetchQueries: [{ query: LIST_ROOM }],
  });
  const [updateRoom] = useMutation(UPDATE_ROOM, {
    refetchQueries: [{ query: LIST_ROOM }],
  });

  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: LIST_PERSON }],
  });
  const [deletePerson] = useMutation(DELETE_PERSON, {
    refetchQueries: [{ query: LIST_PERSON }],
  });
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [{ query: LIST_PERSON }],
  });

  const [createCourse] = useMutation(CREATE_COURSE, {
    refetchQueries: [{ query: LIST_COURSE }],
  });
  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [{ query: LIST_COURSE }],
  });
  const [updateCourse] = useMutation(UPDATE_COURSE, {
    refetchQueries: [{ query: LIST_COURSE }],
  });

  const [createActivity] = useMutation(CREATE_ACTIVITY, {
    refetchQueries: [{ query: LIST_ACTIVITY }],
  });
  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    refetchQueries: [{ query: LIST_ACTIVITY }],
  });
  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    refetchQueries: [{ query: LIST_ACTIVITY }],
  });

  const [createCourseTeacher] = useMutation(CREATE_COURSE_TEACHER, {
    refetchQueries: [{ query: LIST_COURSE_TEACHER }],
  });
  const [deleteCourseTeacher] = useMutation(DELETE_COURSE_TEACHER, {
    refetchQueries: [{ query: LIST_COURSE_TEACHER }],
  });
  const [updateCourseTeacher] = useMutation(UPDATE_COURSE_TEACHER, {
    refetchQueries: [{ query: LIST_COURSE_TEACHER }],
  });

  const [createAllocation] = useMutation(CREATE_ALLOCATION, {
    refetchQueries: [{ query: LIST_ALLOCATION }],
  });
  const [deleteAllocation] = useMutation(DELETE_ALLOCATION, {
    refetchQueries: [{ query: LIST_ALLOCATION }],
  });
  const [updateAllocation] = useMutation(UPDATE_ALLOCATION, {
    refetchQueries: [{ query: LIST_ALLOCATION }],
  });

  const [createPreference] = useMutation(CREATE_PREFERENCE);
  const [deletePreference] = useMutation(DELETE_PREFERENCE);
  const [updatePreference] = useMutation(UPDATE_PREFERENCE);

  return {
    queries: {
      campusQuery,
      buildingQuery,
      buildingMetadataQuery,
      buildingEdgeQuery,
      roomQuery,
      personQuery,
      courseQuery,
      activityQuery,
      courseTeacherQuery,
      allocationQuery,
      preferenceQuery,
    },
    mutations: {
      createCampus,
      deleteCampus,
      updateCampus,
      createBuilding,
      deleteBuilding,
      updateBuilding,
      createBuildingMetadata,
      deleteBuildingMetadata,
      updateBuildingMetadata,
      createBuildingEdge,
      deleteBuildingEdge,
      updateBuildingEdge,
      createRoom,
      deleteRoom,
      updateRoom,
      createPerson,
      deletePerson,
      updatePerson,
      createCourse,
      deleteCourse,
      updateCourse,
      createActivity,
      deleteActivity,
      updateActivity,
      createCourseTeacher,
      deleteCourseTeacher,
      updateCourseTeacher,
      createAllocation,
      deleteAllocation,
      updateAllocation,
      createPreference,
      deletePreference,
      updatePreference,
    },
  };
}
