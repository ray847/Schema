/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](https://ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf). */
  JSON: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type ActivityInput = {
  name: Scalars['String']['input'];
  personKey: Scalars['ID']['input'];
};

export type ActivityModel = {
  __typename?: 'ActivityModel';
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  person: PersonModel;
  personKey: Scalars['ID']['output'];
};

export type AllocationInput = {
  endTime: Scalars['String']['input'];
  eventKey: Scalars['Int']['input'];
  eventType: EventType;
  roomKey: Scalars['ID']['input'];
  startTime: Scalars['String']['input'];
};

export type AllocationModel = {
  __typename?: 'AllocationModel';
  endTime: Scalars['String']['output'];
  eventKey: Scalars['Int']['output'];
  eventType: EventType;
  key: Scalars['ID']['output'];
  room: RoomModel;
  roomKey: Scalars['ID']['output'];
  startTime: Scalars['String']['output'];
};

export type BuildingInput = {
  buildingType: BuildingType;
  campusKey: Scalars['ID']['input'];
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type BuildingModel = {
  __typename?: 'BuildingModel';
  buildingType: BuildingType;
  campus: CampusModel;
  campusKey: Scalars['ID']['output'];
  key: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rooms: Array<RoomModel>;
};

export enum BuildingType {
  Academic = 'ACADEMIC',
  Cafeteria = 'CAFETERIA',
  Library = 'LIBRARY',
  Other = 'OTHER'
}

export type CampusInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CampusModel = {
  __typename?: 'CampusModel';
  address: Scalars['String']['output'];
  buildings: Array<BuildingModel>;
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CourseInput = {
  courseCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CourseModel = {
  __typename?: 'CourseModel';
  courseCode: Scalars['String']['output'];
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CourseTeacherInput = {
  courseKey: Scalars['ID']['input'];
  personKey: Scalars['ID']['input'];
  responsibility: Scalars['String']['input'];
};

export type CourseTeacherModel = {
  __typename?: 'CourseTeacherModel';
  course: CourseModel;
  courseKey: Scalars['ID']['output'];
  person: PersonModel;
  personKey: Scalars['ID']['output'];
  responsibility: Scalars['String']['output'];
};

export enum EventType {
  Activity = 'ACTIVITY',
  Course = 'COURSE'
}

export type Mutation = {
  __typename?: 'Mutation';
  createActivity?: Maybe<Scalars['Void']['output']>;
  createAllocation?: Maybe<Scalars['Void']['output']>;
  createBuilding?: Maybe<Scalars['Void']['output']>;
  createCampus?: Maybe<Scalars['Void']['output']>;
  createCourse?: Maybe<Scalars['Void']['output']>;
  createCourseTeacher?: Maybe<Scalars['Void']['output']>;
  createPerson?: Maybe<Scalars['Void']['output']>;
  createRoom?: Maybe<Scalars['Void']['output']>;
  deleteActivity?: Maybe<Scalars['Void']['output']>;
  deleteAllocation?: Maybe<Scalars['Void']['output']>;
  deleteBuilding?: Maybe<Scalars['Void']['output']>;
  deleteCampus?: Maybe<Scalars['Void']['output']>;
  deleteCourse?: Maybe<Scalars['Void']['output']>;
  deletePerson?: Maybe<Scalars['Void']['output']>;
  deleteRoom?: Maybe<Scalars['Void']['output']>;
  updateActivity?: Maybe<Scalars['Void']['output']>;
  updateAllocation?: Maybe<Scalars['Void']['output']>;
  updateBuilding?: Maybe<Scalars['Void']['output']>;
  updateCampus?: Maybe<Scalars['Void']['output']>;
  updateCourse?: Maybe<Scalars['Void']['output']>;
  updatePerson?: Maybe<Scalars['Void']['output']>;
  updateRoom?: Maybe<Scalars['Void']['output']>;
};


export type MutationCreateActivityArgs = {
  inputs: Array<ActivityInput>;
};


export type MutationCreateAllocationArgs = {
  inputs: Array<AllocationInput>;
};


export type MutationCreateBuildingArgs = {
  inputs: Array<BuildingInput>;
};


export type MutationCreateCampusArgs = {
  inputs: Array<CampusInput>;
};


export type MutationCreateCourseArgs = {
  inputs: Array<CourseInput>;
};


export type MutationCreateCourseTeacherArgs = {
  inputs: Array<CourseTeacherInput>;
};


export type MutationCreatePersonArgs = {
  inputs: Array<PersonInput>;
};


export type MutationCreateRoomArgs = {
  inputs: Array<RoomInput>;
};


export type MutationDeleteActivityArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteAllocationArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteBuildingArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteCampusArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteCourseArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeletePersonArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteRoomArgs = {
  key: Scalars['ID']['input'];
};


export type MutationUpdateActivityArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdateAllocationArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdateBuildingArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdateCampusArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdateCourseArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdatePersonArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdateRoomArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};

export type PersonInput = {
  name: Scalars['String']['input'];
  personCode: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type PersonModel = {
  __typename?: 'PersonModel';
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  personCode: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  listActivity: Array<ActivityModel>;
  listAllocation: Array<AllocationModel>;
  listBuilding: Array<BuildingModel>;
  listCampus: Array<CampusModel>;
  listCourse: Array<CourseModel>;
  listCourseTeacher: Array<CourseTeacherModel>;
  listPerson: Array<PersonModel>;
  listRoom: Array<RoomModel>;
};

export type RoomInput = {
  buildingKey: Scalars['ID']['input'];
  capacity: Scalars['Int']['input'];
  facility: Scalars['JSON']['input'];
  name: Scalars['String']['input'];
  roomType: RoomType;
};

export type RoomModel = {
  __typename?: 'RoomModel';
  building: BuildingModel;
  buildingKey: Scalars['ID']['output'];
  capacity: Scalars['Int']['output'];
  facility: Scalars['JSON']['output'];
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  roomType: RoomType;
};

export enum RoomType {
  Auditorium = 'AUDITORIUM',
  Laboratory = 'LABORATORY',
  Lecture = 'LECTURE',
  Office = 'OFFICE',
  Other = 'OTHER'
}

export type ListCampusQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCampusQuery = { __typename?: 'Query', listCampus: Array<{ __typename?: 'CampusModel', key: string, name: string, address: string }> };

export type ListBuildingQueryVariables = Exact<{ [key: string]: never; }>;


export type ListBuildingQuery = { __typename?: 'Query', listBuilding: Array<{ __typename?: 'BuildingModel', key: string, name: string, buildingType: BuildingType, location: string, campus: { __typename?: 'CampusModel', name: string } }> };

export type ListRoomQueryVariables = Exact<{ [key: string]: never; }>;


export type ListRoomQuery = { __typename?: 'Query', listRoom: Array<{ __typename?: 'RoomModel', key: string, name: string, roomType: RoomType, capacity: number, facility: any, building: { __typename?: 'BuildingModel', name: string } }> };

export type ListPersonQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPersonQuery = { __typename?: 'Query', listPerson: Array<{ __typename?: 'PersonModel', key: string, personCode: string, name: string, role: string }> };

export type ListCourseQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCourseQuery = { __typename?: 'Query', listCourse: Array<{ __typename?: 'CourseModel', key: string, courseCode: string, name: string }> };

export type ListActivityQueryVariables = Exact<{ [key: string]: never; }>;


export type ListActivityQuery = { __typename?: 'Query', listActivity: Array<{ __typename?: 'ActivityModel', key: string, name: string, person: { __typename?: 'PersonModel', name: string } }> };

export type ListCourseTeacherQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCourseTeacherQuery = { __typename?: 'Query', listCourseTeacher: Array<{ __typename?: 'CourseTeacherModel', personKey: string, courseKey: string, responsibility: string, person: { __typename?: 'PersonModel', name: string }, course: { __typename?: 'CourseModel', name: string } }> };

export type ListAllocationQueryVariables = Exact<{ [key: string]: never; }>;


export type ListAllocationQuery = { __typename?: 'Query', listAllocation: Array<{ __typename?: 'AllocationModel', key: string, eventType: EventType, eventKey: number, startTime: string, endTime: string, room: { __typename?: 'RoomModel', name: string, building: { __typename?: 'BuildingModel', name: string } } }> };


export const ListCampusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCampus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listCampus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<ListCampusQuery, ListCampusQueryVariables>;
export const ListBuildingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListBuilding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listBuilding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"buildingType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"campus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ListBuildingQuery, ListBuildingQueryVariables>;
export const ListRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListRoom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listRoom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"roomType"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"facility"}},{"kind":"Field","name":{"kind":"Name","value":"building"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ListRoomQuery, ListRoomQueryVariables>;
export const ListPersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"personCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<ListPersonQuery, ListPersonQueryVariables>;
export const ListCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"courseCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ListCourseQuery, ListCourseQueryVariables>;
export const ListActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ListActivityQuery, ListActivityQueryVariables>;
export const ListCourseTeacherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListCourseTeacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listCourseTeacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personKey"}},{"kind":"Field","name":{"kind":"Name","value":"courseKey"}},{"kind":"Field","name":{"kind":"Name","value":"responsibility"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ListCourseTeacherQuery, ListCourseTeacherQueryVariables>;
export const ListAllocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListAllocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listAllocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventKey"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"building"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListAllocationQuery, ListAllocationQueryVariables>;