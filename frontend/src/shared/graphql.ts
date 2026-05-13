export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
  JSON: { input: unknown; output: unknown; }
  Void: { input: unknown; output: unknown; }
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
  endTime: Scalars['DateTime']['input'];
  eventKey: Scalars['Int']['input'];
  eventType: EventType;
  roomKey: Scalars['ID']['input'];
  startTime: Scalars['DateTime']['input'];
};

export type AllocationModel = {
  __typename?: 'AllocationModel';
  endTime: Scalars['DateTime']['output'];
  eventKey: Scalars['Int']['output'];
  eventType: EventType;
  key: Scalars['ID']['output'];
  room: RoomModel;
  roomKey: Scalars['ID']['output'];
  startTime: Scalars['DateTime']['output'];
};

export type BuildingEdgeInput = {
  bidirectional?: Scalars['Boolean']['input'];
  distanceMeters?: InputMaybe<Scalars['Float']['input']>;
  edgeType?: BuildingEdgeType;
  fromBuildingKey: Scalars['ID']['input'];
  toBuildingKey: Scalars['ID']['input'];
  walkTimeSeconds: Scalars['Int']['input'];
};

export type BuildingEdgeModel = {
  __typename?: 'BuildingEdgeModel';
  bidirectional: Scalars['Boolean']['output'];
  distanceMeters?: Maybe<Scalars['Float']['output']>;
  edgeType: BuildingEdgeType;
  fromBuilding: BuildingModel;
  fromBuildingKey: Scalars['ID']['output'];
  key: Scalars['ID']['output'];
  toBuilding: BuildingModel;
  toBuildingKey: Scalars['ID']['output'];
  walkTimeSeconds: Scalars['Int']['output'];
};

export enum BuildingEdgeType {
  Indoor = 'INDOOR',
  Other = 'OTHER',
  Shuttle = 'SHUTTLE',
  Stairs = 'STAIRS',
  Walkway = 'WALKWAY'
}

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
  createBuildingEdge?: Maybe<Scalars['Void']['output']>;
  createCampus?: Maybe<Scalars['Void']['output']>;
  createCourse?: Maybe<Scalars['Void']['output']>;
  createCourseTeacher?: Maybe<Scalars['Void']['output']>;
  createPerson?: Maybe<Scalars['Void']['output']>;
  createPreference?: Maybe<Scalars['Void']['output']>;
  createRoom?: Maybe<Scalars['Void']['output']>;
  deleteActivity?: Maybe<Scalars['Void']['output']>;
  deleteAllocation?: Maybe<Scalars['Void']['output']>;
  deleteBuilding?: Maybe<Scalars['Void']['output']>;
  deleteBuildingEdge?: Maybe<Scalars['Void']['output']>;
  deleteCampus?: Maybe<Scalars['Void']['output']>;
  deleteCourse?: Maybe<Scalars['Void']['output']>;
  deleteCourseTeacher?: Maybe<Scalars['Void']['output']>;
  deletePerson?: Maybe<Scalars['Void']['output']>;
  deletePreference?: Maybe<Scalars['Void']['output']>;
  deleteRoom?: Maybe<Scalars['Void']['output']>;
  updateActivity?: Maybe<Scalars['Void']['output']>;
  updateAllocation?: Maybe<Scalars['Void']['output']>;
  updateBuilding?: Maybe<Scalars['Void']['output']>;
  updateBuildingEdge?: Maybe<Scalars['Void']['output']>;
  updateCampus?: Maybe<Scalars['Void']['output']>;
  updateCourse?: Maybe<Scalars['Void']['output']>;
  updateCourseTeacher?: Maybe<Scalars['Void']['output']>;
  updatePerson?: Maybe<Scalars['Void']['output']>;
  updatePreference?: Maybe<Scalars['Void']['output']>;
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


export type MutationCreateBuildingEdgeArgs = {
  inputs: Array<BuildingEdgeInput>;
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


export type MutationCreatePreferenceArgs = {
  input: PreferenceInput;
  userKey: Scalars['ID']['input'];
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


export type MutationDeleteBuildingEdgeArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteCampusArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteCourseArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteCourseTeacherArgs = {
  courseKey: Scalars['ID']['input'];
  personKey: Scalars['ID']['input'];
};


export type MutationDeletePersonArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeletePreferenceArgs = {
  preferenceKey: Scalars['ID']['input'];
  userKey: Scalars['ID']['input'];
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


export type MutationUpdateBuildingEdgeArgs = {
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


export type MutationUpdateCourseTeacherArgs = {
  courseKey: Scalars['ID']['input'];
  personKey: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdatePersonArgs = {
  key: Scalars['ID']['input'];
  replacements: Scalars['JSON']['input'];
};


export type MutationUpdatePreferenceArgs = {
  input: PreferenceInput;
  preferenceKey: Scalars['ID']['input'];
  userKey: Scalars['ID']['input'];
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

export type PreferenceInput = {
  buildingKey?: InputMaybe<Scalars['ID']['input']>;
  campusKey?: InputMaybe<Scalars['ID']['input']>;
  roomKey?: InputMaybe<Scalars['ID']['input']>;
  value: Scalars['Float']['input'];
};

export type PreferenceModel = {
  __typename?: 'PreferenceModel';
  buildingKey?: Maybe<Scalars['ID']['output']>;
  campusKey?: Maybe<Scalars['ID']['output']>;
  key: Scalars['ID']['output'];
  roomKey?: Maybe<Scalars['ID']['output']>;
  value: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  listActivity: Array<ActivityModel>;
  listAllocation: Array<AllocationModel>;
  listBuilding: Array<BuildingModel>;
  listBuildingEdge: Array<BuildingEdgeModel>;
  listCampus: Array<CampusModel>;
  listCourse: Array<CourseModel>;
  listCourseTeacher: Array<CourseTeacherModel>;
  listPerson: Array<PersonModel>;
  listPreference: Array<PreferenceModel>;
  listRoom: Array<RoomModel>;
};


export type QueryListPreferenceArgs = {
  userKey: Scalars['ID']['input'];
};

export type RoomInput = {
  buildingKey: Scalars['ID']['input'];
  capacity: Scalars['Int']['input'];
  facility: Scalars['JSON']['input'];
  floor?: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  roomType: RoomType;
};

export type RoomModel = {
  __typename?: 'RoomModel';
  building: BuildingModel;
  buildingKey: Scalars['ID']['output'];
  capacity: Scalars['Int']['output'];
  facility: Scalars['JSON']['output'];
  floor: Scalars['Int']['output'];
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
